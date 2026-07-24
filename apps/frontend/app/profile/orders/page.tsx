'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

// Mock order data - replace with actual API data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 129.99,
    items: 3,
    products: ['Wireless Headphones', 'Phone Case', 'Screen Protector'],
  },
  {
    id: 'ORD-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 79.99,
    items: 2,
    products: ['USB-C Cable', 'Wireless Mouse'],
  },
  {
    id: 'ORD-003',
    date: '2024-01-25',
    status: 'processing',
    total: 249.99,
    items: 1,
    products: ['Mechanical Keyboard'],
  },
];

const statusConfig = {
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  processing: {
    label: 'Processing',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'bg-red-100 text-red-700 border-red-200',
  },
};

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/profile')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {mockOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't placed any orders. Start shopping to see your orders here.
              </p>
              <Button onClick={() => router.push('/products')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          mockOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.products.map((product, index) => (
                          <span
                            key={index}
                            className="text-sm bg-muted px-2 py-1 rounded"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Order Total & Items */}
                    <div className="flex sm:flex-col items-start sm:items-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {order.items} {order.items === 1 ? 'item' : 'items'}
                        </p>
                        <p className="text-2xl font-bold">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
