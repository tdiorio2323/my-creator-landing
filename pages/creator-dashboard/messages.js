import Head from 'next/head'
import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import MessagingSystem from '../../components/creator-dashboard/MessagingSystem'

export default function MessagesPage() {
  return (
    <>
      <Head>
        <title>Messages - Creator Dashboard</title>
        <meta name="description" content="Communicate with your fans and manage messages" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header />
        
        <div className="flex">
          <Sidebar userType="creator" />
          
          <main className="flex-1 p-6">
            <MessagingSystem />
          </main>
        </div>
      </div>
    </>
  )
}