import dynamic from 'next/dynamic'

const NewProductForm = dynamic(() => import('./NewProductForm'), { 
  ssr: false,
})

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold ml-6">Create a new beat</h1>
      <NewProductForm />
    </div>
  )
}

