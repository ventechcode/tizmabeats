export default function Page({ params }: { params: { id: string } }) {
    return <div>Order ID: {params.id}</div>
  }