export function Tabs({ children }) {return <div>{children}</div>;}
export function TabsList({ children }) {return <div className="flex gap-2 mb-2">{children}</div>;}
export function TabsTrigger({ onClick, children }) {return <button onClick={onClick} className="px-3 py-1 border rounded-lg text-sm">{children}</button>;}
export function TabsContent({ children }) {return <div>{children}</div>;}