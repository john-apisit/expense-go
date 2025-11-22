export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatMonth(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
  })
}

export function getMonthKey(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1)
}

export function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0)
}

export function parseMonthKey(monthKey: string): { year: number; month: number } {
  const [year, month] = monthKey.split('-').map(Number)
  return { year, month: month - 1 }
}

export function isMonthInRange(
  monthKey: string,
  startMonth: string | null,
  endMonth: string | null
): boolean {
  if (!startMonth) return false
  
  if (!endMonth) {
    return monthKey >= startMonth
  }
  
  return monthKey >= startMonth && monthKey <= endMonth
}

export function formatDateInput(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

export function formatMonthInput(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

