import { useState, useEffect } from 'react'
import { X, ArrowRight, ArrowLeft, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Image {
  _id: string
  title: string
  url: string
  createdAt: string
}

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [newImage, setNewImage] = useState({ title: '', file: null as File | null })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/images')
        if (!response.ok) throw new Error('Failed to fetch images')
        const data = await response.json()
        setImages(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  const openModal = (id: string) => {
    setSelectedImage(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  const navigateImage = (direction: 'next' | 'prev') => {
    if (selectedImage === null) return

    const currentIndex = images.findIndex(img => img._id === selectedImage)
    let newIndex

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length
    }

    setSelectedImage(images[newIndex]._id)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage({ ...newImage, file: e.target.files[0] })
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImage.file || !newImage.title) return

    const formData = new FormData()
    formData.append('title', newImage.title)
    formData.append('image', newImage.file)

    try {
      const response = await fetch('http://localhost:5000/api/images', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      setImages([...images, data])
      setIsUploadOpen(false)
      setNewImage({ title: '', file: null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  const selectedImageData = images.find(img => img._id === selectedImage)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Photo Gallery</h1>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Image
          </Button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card 
                  key={image._id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => openModal(image._id)}
                >
                  <CardContent className="p-0 aspect-square">
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </CardContent>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{image.title}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Upload Modal */}
            {isUploadOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <Card className="relative max-w-md w-full">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={() => setIsUploadOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                  
                  <CardHeader>
                    <CardTitle>Upload New Image</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleUpload} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input 
                          value={newImage.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            setNewImage({...newImage, title: e.target.value})
                          }
                          placeholder="Image title"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Image File</label>
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Upload
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Image View Modal */}
            {isModalOpen && selectedImageData && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="relative max-w-4xl w-full">
                  {/* Close Button */}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute -top-12 right-0 text-white hover:bg-white hover:bg-opacity-10"
                    onClick={closeModal}
                  >
                    <X className="h-6 w-6" />
                  </Button>

                  {/* Image Display */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-0 aspect-[4/3]">
                      <img 
                        src={selectedImageData.url} 
                        alt={selectedImageData.title}
                        className="w-full h-full object-contain"
                      />
                    </CardContent>
                    <CardHeader>
                      <CardTitle>{selectedImageData.title}</CardTitle>
                    </CardHeader>
                  </Card>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      className="text-white border-white hover:bg-white hover:bg-opacity-10"
                      onClick={() => navigateImage('prev')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-white border-white hover:bg-white hover:bg-opacity-10"
                      onClick={() => navigateImage('next')}
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}