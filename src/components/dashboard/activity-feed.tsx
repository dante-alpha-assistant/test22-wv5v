interface Customer {
  id: string;
  name: string;
  createdAt: string | Date;
}

interface ActivityFeedProps {
  recentCustomers: Customer[];
}

export function ActivityFeed({ recentCustomers }: ActivityFeedProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {recentCustomers.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity</p>
        ) : (
          recentCustomers.map((customer) => (
            <div key={customer.id} className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium">New customer: {customer.name}</p>
                <p className="text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
