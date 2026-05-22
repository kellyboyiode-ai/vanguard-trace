import { useEffect } from 'react';

const PROTECTED_MEDIA_SELECTOR =
  'img, video, audio, canvas, svg, picture';
const INTERACTION_ESCAPE_SELECTOR = '[data-allow-media-interaction="true"]';

function hasProtectedMediaTarget(target) {
  if (!(target instanceof Element)) {
    return false;
  }

  if (target.closest(INTERACTION_ESCAPE_SELECTOR)) {
    return false;
  }

  return Boolean(target.closest(PROTECTED_MEDIA_SELECTOR));
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
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('contextmenu', blockMediaAction, true);
      document.removeEventListener('dragstart', blockMediaAction, true);
      document.removeEventListener('selectstart', blockMediaAction, true);
      observer.disconnect();
    };
  }, []);
}

export default useMediaAssetProtection;