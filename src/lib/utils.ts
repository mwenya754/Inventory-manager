export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatCurrency(amount: number): string {
  return `K ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getWeekRange(date: Date = new Date()): { start: Date; end: Date; label: string } {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay(); // First day is Sunday
  const start = new Date(curr.setDate(first));
  const end = new Date(curr.setDate(first + 6));
  
  const label = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  
  return { start, end, label };
}

export function getCurrentWeek(): string {
  const { start, end } = getWeekRange();
  return `${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}`;
}

export function isDateInWeek(date: string, weekStart: Date, weekEnd: Date): boolean {
  const saleDate = new Date(date);
  return saleDate >= weekStart && saleDate <= weekEnd;
}
