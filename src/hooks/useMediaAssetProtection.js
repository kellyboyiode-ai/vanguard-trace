import { useEffect } from 'react';

const PROTECTED_MEDIA_SELECTOR =
  'img, video, audio, canvas, svg, picture';
const INTERACTION_ESCAPE_SELECTOR = '[data-allow-media-interaction="true"]';
const MEDIA_FILE_PATTERN =
  /\.(avif|bmp|gif|jpe?g|png|svg|webp|mp4|webm|mov|m4v|mp3|wav|ogg|ogv|m4a)(\?.*)?$/i;

function hasProtectedMediaTarget(target) {
  if (!(target instanceof Element)) {
    return false;
  }

  if (target.closest(INTERACTION_ESCAPE_SELECTOR)) {
    return false;
  }

  return Boolean(target.closest(PROTECTED_MEDIA_SELECTOR));
}

function getProtectedMediaLink(target) {
  if (!(target instanceof Element)) {
    return null;
  }

  if (target.closest(INTERACTION_ESCAPE_SELECTOR)) {
    return null;
  }

  const mediaNode = target.closest(PROTECTED_MEDIA_SELECTOR);
  const linkNode = target.closest('a[href]');

  if (!mediaNode || !linkNode || !linkNode.contains(mediaNode)) {
    return null;
  }

  return linkNode;
}

function isDirectMediaLink(linkNode) {
  if (!(linkNode instanceof HTMLAnchorElement)) {
    return false;
  }

  return (
    Boolean(linkNode.getAttribute('download')) ||
    MEDIA_FILE_PATTERN.test(linkNode.getAttribute('href') || '')
  );
}

function hardenMediaNode(node) {
  if (!(node instanceof Element)) {
    return;
  }

  if (!node.matches(PROTECTED_MEDIA_SELECTOR) && !node.querySelector) {
    return;
  }

  const mediaNodes = node.matches(PROTECTED_MEDIA_SELECTOR)
    ? [node]
    : Array.from(node.querySelectorAll(PROTECTED_MEDIA_SELECTOR));

  mediaNodes.forEach((mediaNode) => {
    if (mediaNode.closest(INTERACTION_ESCAPE_SELECTOR)) {
      return;
    }

    mediaNode.setAttribute('draggable', 'false');

    if ('disablePictureInPicture' in mediaNode) {
      mediaNode.disablePictureInPicture = true;
    }

    if ('disableRemotePlayback' in mediaNode) {
      mediaNode.disableRemotePlayback = true;
    }

    if (mediaNode instanceof HTMLMediaElement) {
      mediaNode.setAttribute(
        'controlsList',
        'nodownload noplaybackrate noremoteplayback',
      );
    }
  });
}

export function useMediaAssetProtection() {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    hardenMediaNode(document.body);

    const blockMediaAction = (event) => {
      if (hasProtectedMediaTarget(event.target)) {
        event.preventDefault();
      }
    };

    const blockMediaLinkAction = (event) => {
      const mediaLink = getProtectedMediaLink(event.target);

      if (!mediaLink) {
        return;
      }

      const isModifiedOpen =
        event.type === 'auxclick' ||
        event.button === 1 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey;

      if (isModifiedOpen || isDirectMediaLink(mediaLink)) {
        event.preventDefault();
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          hardenMediaNode(node);
        });
      });
    });

    document.addEventListener('contextmenu', blockMediaAction, true);
    document.addEventListener('dragstart', blockMediaAction, true);
    document.addEventListener('selectstart', blockMediaAction, true);
    document.addEventListener('copy', blockMediaAction, true);
    document.addEventListener('click', blockMediaLinkAction, true);
    document.addEventListener('auxclick', blockMediaLinkAction, true);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('contextmenu', blockMediaAction, true);
      document.removeEventListener('dragstart', blockMediaAction, true);
      document.removeEventListener('selectstart', blockMediaAction, true);
      document.removeEventListener('copy', blockMediaAction, true);
      document.removeEventListener('click', blockMediaLinkAction, true);
      document.removeEventListener('auxclick', blockMediaLinkAction, true);
      observer.disconnect();
    };
  }, []);
}

export default useMediaAssetProtection;