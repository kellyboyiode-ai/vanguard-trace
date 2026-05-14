import { supabase } from '../lib/supabase';

export async function getAdminDashboardSnapshot() {
  const [shipments, reports, messages] = await Promise.all([
    supabase.from('shipments').select('id', { head: true, count: 'exact' }),
    supabase
      .from('reports')
      .select('id', { head: true, count: 'exact' })
      .eq('status', 'PENDING'),
    supabase
      .from('messages')
      .select('id', { head: true, count: 'exact' })
      .eq('is_read', false),
  ]);

  return {
    source: 'supabase',
    error: shipments.error || reports.error || messages.error,
    data: {
      activeShipments: shipments.count || 0,
      pendingReports: reports.count || 0,
      unreadMessages: messages.count || 0,
    },
  };
}
