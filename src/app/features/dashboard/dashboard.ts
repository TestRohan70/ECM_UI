import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  icon: string;
  badge?: number;
  active?: boolean;
}

interface KpiCard {
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface ChartPoint {
  day: string;
  value: number;
}

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private router = inject(Router);

  currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  navGroups: NavGroup[] = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Main Dashboard', icon: 'grid', active: true },
        { label: 'Website Traffic', icon: 'bar-chart' },
        { label: 'Analytics', icon: 'trending-up' },
      ]
    },
    {
      group: 'MANAGEMENT',
      items: [
        { label: 'Orders', icon: 'bar-chart-2', badge: 8 },
        { label: 'Products', icon: 'package' },
        { label: 'Customers', icon: 'users' },
        { label: 'Partners', icon: 'layout' },
        { label: 'International', icon: 'globe' },
      ]
    },
    {
      group: 'SETTINGS',
      items: [
        { label: 'SEO', icon: 'pie-chart' },
        { label: 'Calendar', icon: 'calendar' },
        { label: 'Password', icon: 'lock' },
        { label: 'Sales', icon: 'monitor' },
      ]
    }
  ];

  kpiCards: KpiCard[] = [
    { title: 'Total Revenue',    value: '$284,520',  change: +12.5, icon: 'dollar',   color: '#6366f1' },
    { title: 'Total Orders',     value: '14,820',    change: +8.2,  icon: 'shopping', color: '#10b981' },
    { title: 'Active Customers', value: '9,340',     change: +5.1,  icon: 'users2',   color: '#f59e0b' },
    { title: 'Avg. Order Value', value: '$19.20',    change: -2.3,  icon: 'target',   color: '#ef4444' },
  ];

  chartData: ChartPoint[] = [
    { day: 'Sun', value: 15000 },
    { day: 'Mon', value: 21500 },
    { day: 'Tue', value: 19000 },
    { day: 'Wed', value: 24000 },
    { day: 'Thu', value: 23500 },
    { day: 'Fri', value: 24000 },
    { day: 'Sat', value: 12000 },
  ];

  recentOrders: Order[] = [
    { id: '#ORD-8821', customer: 'James Wilson',   product: 'MacBook Pro 14"',   amount: 2499, status: 'Completed', date: 'Jun 4, 2026' },
    { id: '#ORD-8820', customer: 'Sarah Chen',     product: 'iPhone 16 Pro',     amount: 1099, status: 'Pending',   date: 'Jun 4, 2026' },
    { id: '#ORD-8819', customer: 'Michael Brown',  product: 'AirPods Pro',       amount: 249,  status: 'Completed', date: 'Jun 3, 2026' },
    { id: '#ORD-8818', customer: 'Emma Davis',     product: 'iPad Air M2',       amount: 749,  status: 'Cancelled', date: 'Jun 3, 2026' },
    { id: '#ORD-8817', customer: 'Robert Taylor',  product: 'Apple Watch Ultra', amount: 799,  status: 'Completed', date: 'Jun 2, 2026' },
  ];

  /* ── SVG chart ── */
  svgWidth      = 800;
  svgHeight     = 280;
  paddingLeft   = 55;
  paddingRight  = 24;
  paddingTop    = 24;
  paddingBottom = 44;
  minValue      = 10000;
  maxValue      = 26000;

  get plotWidth()  { return this.svgWidth  - this.paddingLeft - this.paddingRight; }
  get plotHeight() { return this.svgHeight - this.paddingTop  - this.paddingBottom; }
  get yLabels():   number[] { return [26000, 24000, 22000, 20000, 18000, 16000, 14000, 12000, 10000]; }

  xPos(i: number): number {
    return this.paddingLeft + (i / (this.chartData.length - 1)) * this.plotWidth;
  }

  yPos(v: number): number {
    return this.paddingTop + this.plotHeight -
      ((v - this.minValue) / (this.maxValue - this.minValue)) * this.plotHeight;
  }

  get polylinePoints(): string {
    return this.chartData.map((p, i) => `${this.xPos(i)},${this.yPos(p.value)}`).join(' ');
  }

  get areaPath(): string {
    const pts  = this.chartData.map((p, i) => `${this.xPos(i)},${this.yPos(p.value)}`).join(' L ');
    const base = this.paddingTop + this.plotHeight;
    return `M ${this.xPos(0)},${base} L ${pts} L ${this.xPos(this.chartData.length - 1)},${base} Z`;
  }

  setActive(item: NavItem): void {
    this.navGroups.forEach(g => g.items.forEach(n => (n.active = false)));
    item.active = true;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
