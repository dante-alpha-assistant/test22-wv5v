import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RecentCustomer {
  id: string;
  name: string;
  email: string;
  company: string | null;
  status: string;
  createdAt: string | Date;
}

interface RecentCustomersProps {
  customers: RecentCustomer[];
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "secondary",
  lead: "outline",
  churned: "destructive",
};

export function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Recent Customers</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No customers yet
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-500">{customer.email}</div>
                </TableCell>
                <TableCell>{customer.company ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[customer.status] ?? "outline"}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
