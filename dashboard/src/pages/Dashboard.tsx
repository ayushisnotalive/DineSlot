export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-charcoal-deep font-body-md text-body-md text-on-surface selection:bg-terracotta-glow selection:text-white">
{/* SideNavBar (Hidden on mobile, block on md) */}
<nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-low border-r border-muted shadow-md py-stack-lg z-40">
<div className="px-gutter mb-section-gap flex flex-col gap-stack-sm">
<div className="flex items-center gap-stack-md">
<img alt="DineSlot Logo" className="w-10 h-10 rounded-full object-cover border border-muted" data-alt="A stylized, minimalist logo mark for a high-end restaurant named DineSlot, featuring abstract geometric representations of a table setting in soft warm lighting against a deep slate background. The aesthetic is modern, elegant, and sophisticated." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKYDOgSca7urMCRGeFE7DvoEt6euHXLDU9PcRonL2MBKJPyZaY8V0mKoJ2-yRI8M19kxUjEzwlipFGD7fUL_ulWkUmXXif61YfCsaEc1uIDie5BDKDpAKj-hLygLkD5sWSjGrt6kInnKngwhQMZHhQW49RI9hRFLTiIzqiWAtsNWe-W1s-qJjFb_1mqZcz48Mf75DRJ2YzAmAm73rl42lF4ipgGt19OdQITqSFtOWvLA81wNVjWPWQvg"/>
<div>
<h1 className="font-headline-md text-headline-md text-terracotta-glow font-bold">DineSlot</h1>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Premium Management</p>
</div>
</div>
</div>
<div className="flex-1 px-4 flex flex-col gap-stack-sm">
<a className="flex items-center gap-stack-md text-primary bg-surface-container-highest rounded-xl px-4 py-3 group hover:bg-slate-glass hover:backdrop-blur-md transition-all translate-x-1 duration-200" href="#">
<span className="material-symbols-outlined group-hover:text-terracotta-glow transition-colors">event_seat</span>
<span className="font-label-md text-label-md">Reservations</span>
</a>
<a className="flex items-center gap-stack-md text-on-surface-variant hover:text-on-surface px-4 py-3 group hover:bg-slate-glass hover:backdrop-blur-md transition-all" href="#">
<span className="material-symbols-outlined group-hover:text-terracotta-glow transition-colors">table_restaurant</span>
<span className="font-label-md text-label-md">Tables</span>
</a>
<a className="flex items-center gap-stack-md text-on-surface-variant hover:text-on-surface px-4 py-3 group hover:bg-slate-glass hover:backdrop-blur-md transition-all" href="#">
<span className="material-symbols-outlined group-hover:text-terracotta-glow transition-colors">layers</span>
<span className="font-label-md text-label-md">Floor Plan</span>
</a>
<a className="flex items-center gap-stack-md text-on-surface-variant hover:text-on-surface px-4 py-3 group hover:bg-slate-glass hover:backdrop-blur-md transition-all" href="#">
<span className="material-symbols-outlined group-hover:text-terracotta-glow transition-colors">analytics</span>
<span className="font-label-md text-label-md">Analytics</span>
</a>
</div>
<div className="px-4 mt-auto flex flex-col gap-stack-sm pt-stack-md border-t border-muted mx-4">
<a className="flex items-center gap-stack-md text-on-surface-variant hover:text-on-surface px-4 py-3 group hover:bg-slate-glass hover:backdrop-blur-md transition-all" href="#">
<span className="material-symbols-outlined group-hover:text-terracotta-glow transition-colors">help</span>
<span className="font-label-md text-label-md">Support</span>
</a>
<a className="flex items-center gap-stack-md text-on-surface-variant hover:text-on-surface px-4 py-3 group hover:bg-slate-glass hover:backdrop-blur-md transition-all" href="#">
<span className="material-symbols-outlined group-hover:text-terracotta-glow transition-colors">logout</span>
<span className="font-label-md text-label-md">Logout</span>
</a>
</div>
</nav>
{/* Main Content Area */}
<main className="flex-1 md:ml-64 flex flex-col min-h-screen">
{/* TopAppBar (Visible on all screens) */}
<header className="w-full h-16 sticky top-0 z-50 bg-charcoal-deep dark:bg-charcoal-deep flex justify-between items-center px-gutter flat no shadows border-b border-muted">
<div className="flex items-center md:hidden">
<h1 className="font-headline-md text-headline-md text-terracotta-glow font-bold tracking-tight">DineSlot</h1>
</div>
<div className="flex-1 flex justify-end md:justify-between items-center gap-stack-lg">
{/* Search (Desktop only for this layout) */}
<div className="hidden md:flex relative max-w-md w-full">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-low border border-muted rounded-full py-2 pl-10 pr-4 text-body-sm text-on-surface focus:outline-none focus:border-terracotta-glow focus:ring-1 focus:ring-terracotta-glow transition-colors placeholder:text-on-surface-variant" placeholder="Search reservations, guests..." type="text"/>
</div>
<div className="flex items-center gap-stack-md">
<button className="p-2 text-on-surface-variant hover:text-terracotta-glow transition-colors cursor-pointer active:opacity-80 transition-opacity rounded-full hover:bg-surface-container-low relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-terracotta-glow rounded-full"></span>
</button>
<button className="p-2 text-on-surface-variant hover:text-terracotta-glow transition-colors cursor-pointer active:opacity-80 transition-opacity rounded-full hover:bg-surface-container-low hidden sm:block">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden border border-muted cursor-pointer active:opacity-80 transition-opacity">
<img alt="Manager Profile" className="w-full h-full object-cover" data-alt="A professional headshot of a restaurant manager in soft dramatic lighting, wearing a dark bespoke suit against a deep charcoal background, exuding hospitality and calm competence." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZQSD4EK3yN80E4CnCysZbbgDa84cvlkP3t3shNVaAYs1VTe2t4Sr5p7wKXmkVTCfio1fnMjWdeJ9UaVyoqbE7kXSW59-adyLacz-oTCp2Zi_Rv_7WfZuasMTEXLK913nFaxHwKOlgTt01FPtmfkQDTpOyK3WnzFm1mL3yRWX_vDCP-QytGb16gtn8lKER9AKqkGcr7hCmhZHBav7EaLCOfbupl6Mp0HNl1gQuc-X2bZAPWotDI3-v0A"/>
</div>
</div>
</div>
</header>
{/* Dashboard Content Canvas */}
<div className="p-margin-mobile md:p-gutter lg:p-section-gap flex flex-col gap-section-gap max-w-container-max mx-auto w-full">
{/* Welcome Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md">
<div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-semibold">Tonight's Service</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Friday, October 27th • Dinner Shift</p>
</div>
<button className="bg-terracotta-glow text-white font-label-md px-6 py-3 rounded-lg hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_14px_0_rgba(217,119,6,0.39)]">
                    New Reservation
                </button>
</div>
{/* Bento Grid: Daily Overview */}
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
{/* Metric 1 */}
<div className="glass-card rounded-xl p-stack-lg flex flex-col gap-stack-sm relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all"></div>
<div className="flex justify-between items-start">
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Reservations</p>
<span className="material-symbols-outlined text-terracotta-glow">book_online</span>
</div>
<p className="font-headline-xl text-headline-xl text-on-surface mt-2">142</p>
<p className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-auto">
<span className="material-symbols-outlined text-[16px]">trending_up</span> +12% vs last Friday
                    </p>
</div>
{/* Metric 2 */}
<div className="glass-card rounded-xl p-stack-lg flex flex-col gap-stack-sm relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all"></div>
<div className="flex justify-between items-start">
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tables Occupied</p>
<span className="material-symbols-outlined text-terracotta-glow">restaurant</span>
</div>
<p className="font-headline-xl text-headline-xl text-on-surface mt-2">28<span className="font-headline-md text-headline-md text-on-surface-variant">/45</span></p>
<div className="w-full bg-surface-container-low h-1.5 rounded-full mt-auto overflow-hidden">
<div className="bg-terracotta-glow h-full rounded-full" style={{ width: '62%' }}></div>
</div>
</div>
{/* Metric 3 */}
<div className="glass-card rounded-xl p-stack-lg flex flex-col gap-stack-sm relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all"></div>
<div className="flex justify-between items-start">
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Waitlist</p>
<span className="material-symbols-outlined text-terracotta-glow">hourglass_empty</span>
</div>
<p className="font-headline-xl text-headline-xl text-on-surface mt-2">8 <span className="font-body-md text-body-md text-on-surface-variant font-normal tracking-normal">parties</span></p>
<p className="font-label-sm text-label-sm text-error flex items-center gap-1 mt-auto">
                        Est. wait: 45m
                    </p>
</div>
{/* Metric 4 */}
<div className="glass-card rounded-xl p-stack-lg flex flex-col gap-stack-sm relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-all"></div>
<div className="flex justify-between items-start">
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Est. Revenue</p>
<span className="material-symbols-outlined text-terracotta-glow">payments</span>
</div>
<p className="font-headline-xl text-headline-xl text-on-surface mt-2">$12.4k</p>
<p className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-auto">
                        Avg check: $185
                    </p>
</div>
</section>
{/* Main Split: Floor Plan & List */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
{/* Current Floor Status */}
<section className="lg:col-span-2 glass-card rounded-xl p-stack-lg flex flex-col h-full">
<div className="flex justify-between items-center mb-stack-lg pb-stack-sm border-b border-muted">
<h3 className="font-headline-md text-headline-md text-on-surface">Floor Status</h3>
<div className="flex gap-4">
<span className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant"><span className="w-3 h-3 rounded-full bg-surface-container-low border border-muted"></span> Available</span>
<span className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant"><span className="w-3 h-3 rounded-full bg-terracotta-glow/80 border border-terracotta-glow"></span> Occupied</span>
<span className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant"><span className="w-3 h-3 rounded-full bg-slate-glass border border-muted"></span> Reserved</span>
</div>
</div>
{/* Abstract Floor Plan Grid */}
<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
{/* Table (Occupied) */}
<div className="aspect-square rounded-lg bg-terracotta-glow/10 border border-terracotta-glow/50 flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-terracotta-glow/20 transition-colors group">
<span className="font-headline-md text-headline-md text-terracotta-glow">T1</span>
<span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-terracotta-glow transition-colors">4 Top</span>
</div>
{/* Table (Available) */}
<div className="aspect-square rounded-lg bg-surface-container-low border border-muted flex flex-col justify-center items-center gap-1 cursor-pointer hover:border-on-surface-variant transition-colors group">
<span className="font-headline-md text-headline-md text-on-surface-variant group-hover:text-on-surface transition-colors">T2</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">2 Top</span>
</div>
{/* Table (Reserved) */}
<div className="aspect-square rounded-lg bg-slate-glass border border-muted flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-surface-container-highest transition-colors group relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-transparent to-surface-container-highest opacity-50"></div>
<span className="font-headline-md text-headline-md text-on-surface z-10">T3</span>
<span className="font-label-sm text-label-sm text-on-surface-variant z-10">8:00 PM</span>
</div>
{/* Table (Occupied) */}
<div className="aspect-square rounded-lg bg-terracotta-glow/10 border border-terracotta-glow/50 flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-terracotta-glow/20 transition-colors group">
<span className="font-headline-md text-headline-md text-terracotta-glow">T4</span>
<span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-terracotta-glow transition-colors">2 Top</span>
</div>
{/* Table (Available) */}
<div className="aspect-square rounded-lg bg-surface-container-low border border-muted flex flex-col justify-center items-center gap-1 cursor-pointer hover:border-on-surface-variant transition-colors group">
<span className="font-headline-md text-headline-md text-on-surface-variant group-hover:text-on-surface transition-colors">T5</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">4 Top</span>
</div>
{/* Table (Available) */}
<div className="aspect-square rounded-lg bg-surface-container-low border border-muted flex flex-col justify-center items-center gap-1 cursor-pointer hover:border-on-surface-variant transition-colors group">
<span className="font-headline-md text-headline-md text-on-surface-variant group-hover:text-on-surface transition-colors">T6</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">6 Top</span>
</div>
{/* Table (Reserved) */}
<div className="aspect-square rounded-lg bg-slate-glass border border-muted flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-surface-container-highest transition-colors group relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-transparent to-surface-container-highest opacity-50"></div>
<span className="font-headline-md text-headline-md text-on-surface z-10">T7</span>
<span className="font-label-sm text-label-sm text-on-surface-variant z-10">8:30 PM</span>
</div>
{/* Table (Reserved) */}
<div className="aspect-square rounded-lg bg-slate-glass border border-muted flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-surface-container-highest transition-colors group relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-transparent to-surface-container-highest opacity-50"></div>
<span className="font-headline-md text-headline-md text-on-surface z-10">T8</span>
<span className="font-label-sm text-label-sm text-on-surface-variant z-10">8:15 PM</span>
</div>
{/* Table (Occupied) */}
<div className="aspect-square rounded-lg bg-terracotta-glow/10 border border-terracotta-glow/50 flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-terracotta-glow/20 transition-colors group">
<span className="font-headline-md text-headline-md text-terracotta-glow">T9</span>
<span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-terracotta-glow transition-colors">4 Top</span>
</div>
{/* Table (Available) */}
<div className="aspect-square rounded-lg bg-surface-container-low border border-muted flex flex-col justify-center items-center gap-1 cursor-pointer hover:border-on-surface-variant transition-colors group">
<span className="font-headline-md text-headline-md text-on-surface-variant group-hover:text-on-surface transition-colors">T10</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">2 Top</span>
</div>
</div>
</section>
{/* Upcoming Reservations */}
<section className="lg:col-span-1 glass-card rounded-xl p-stack-lg flex flex-col h-full max-h-[600px] overflow-hidden">
<div className="flex justify-between items-center mb-stack-md pb-stack-sm border-b border-muted">
<h3 className="font-headline-md text-headline-md text-on-surface">Upcoming</h3>
<button className="text-terracotta-glow hover:text-white transition-colors">
<span className="material-symbols-outlined">filter_list</span>
</button>
</div>
<div className="flex-1 overflow-y-auto pr-2 space-y-2">
{/* List Item */}
<div className="p-3 rounded-lg bg-transparent hover:bg-surface-container-low border border-transparent hover:border-muted transition-colors cursor-pointer flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-headline-md text-terracotta-glow">EC</div>
<div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Eleanor Croft</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">VIP • Anniversary</p>
</div>
</div>
<div className="text-right">
<p className="font-body-md text-body-md text-on-surface">7:30 PM</p>
<p className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-end gap-1"><span className="material-symbols-outlined text-[14px]">group</span> 2</p>
</div>
</div>
{/* List Item */}
<div className="p-3 rounded-lg bg-transparent hover:bg-surface-container-low border border-transparent hover:border-muted transition-colors cursor-pointer flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-headline-md text-terracotta-glow">JW</div>
<div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Jameson Wright</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">First Time</p>
</div>
</div>
<div className="text-right">
<p className="font-body-md text-body-md text-on-surface">7:45 PM</p>
<p className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-end gap-1"><span className="material-symbols-outlined text-[14px]">group</span> 4</p>
</div>
</div>
{/* List Item */}
<div className="p-3 rounded-lg bg-transparent hover:bg-surface-container-low border border-transparent hover:border-muted transition-colors cursor-pointer flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-headline-md text-terracotta-glow">SL</div>
<div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Sarah Lin</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">Regular</p>
</div>
</div>
<div className="text-right">
<p className="font-body-md text-body-md text-on-surface">8:00 PM</p>
<p className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-end gap-1"><span className="material-symbols-outlined text-[14px]">group</span> 6</p>
</div>
</div>
{/* List Item */}
<div className="p-3 rounded-lg bg-transparent hover:bg-surface-container-low border border-transparent hover:border-muted transition-colors cursor-pointer flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-headline-md text-terracotta-glow">MP</div>
<div>
<p className="font-body-md text-body-md text-on-surface font-semibold">Marcus Pierce</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">Business</p>
</div>
</div>
<div className="text-right">
<p className="font-body-md text-body-md text-on-surface">8:15 PM</p>
<p className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-end gap-1"><span className="material-symbols-outlined text-[14px]">group</span> 2</p>
</div>
</div>
{/* List Item */}
<div className="p-3 rounded-lg bg-transparent hover:bg-surface-container-low border border-transparent hover:border-muted transition-colors cursor-pointer flex justify-between items-center opacity-50">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-headline-md text-on-surface-variant">AH</div>
<div>
<p className="font-body-md text-body-md text-on-surface-variant font-semibold line-through">Alice Hayes</p>
<p className="font-label-sm text-label-sm text-error">Cancelled</p>
</div>
</div>
<div className="text-right">
<p className="font-body-md text-body-md text-on-surface-variant">8:30 PM</p>
<p className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-end gap-1"><span className="material-symbols-outlined text-[14px]">group</span> 4</p>
</div>
</div>
</div>
<button className="w-full mt-stack-md py-3 border border-muted rounded-lg text-on-surface-variant font-label-md hover:text-white hover:border-white transition-colors bg-surface-container-low/50">
                        View Full List
                    </button>
</section>
</div>
</div>
</main>

    </div>
  );
}
