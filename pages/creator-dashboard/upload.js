import Head from 'next/head'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import UploadCenter from '../../components/creator-dashboard/UploadCenter'

export default function UploadPage() {
  return (
    <>
      <Head>
        <title>Upload Content - Creator Dashboard</title>
        <meta name="description" content="Upload and manage your content for subscribers" />
      </Head>

      <Header />
      
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar userType="creator" />
        
        <main className="flex-1 p-6">
          <UploadCenter />
        </main>
      </div>
    </>
  )
}