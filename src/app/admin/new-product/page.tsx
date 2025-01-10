import dynamic from 'next/dynamic'

const NewProductForm = dynamic(() => import('./NewProductForm'), { 
  ssr: false,
})

export default function NewProductPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-2">Create new Beat</h1>
      <NewProductForm />
    </div>
  )
}

