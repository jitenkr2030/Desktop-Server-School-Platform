import { NewNavigation } from "@/components/new-navigation"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">Last updated: December 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using INR99 Academy's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Services</h2>
              <p className="text-gray-600 mb-4">
                Our services are intended for educational purposes only. You agree to use our platform only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.
              </p>
              <p className="text-gray-600">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Course Enrollment and Payment</h2>
              <p className="text-gray-600 mb-4">
                Enrollment in courses is subject to payment of the applicable fees. All fees are final unless otherwise stated in our refund policy. We reserve the right to change course fees at any time.
              </p>
              <p className="text-gray-600">
                Upon successful payment, you will receive access to the course materials. You have lifetime access to the purchased courses, subject to the terms of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                All content provided on this platform, including courses, videos, text, images, and other materials, is the intellectual property of INR99 Academy or its content creators.
              </p>
              <p className="text-gray-600">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from our platform without explicit written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Conduct</h2>
              <p className="text-gray-600 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share your account credentials with others</li>
                <li>Copy, distribute, or disclose any course content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimer</h2>
              <p className="text-gray-600">
                The courses and content provided on INR99 Academy are for educational purposes only. We do not guarantee employment, salary, or career advancement as a result of completing our courses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600">
                INR99 Academy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify or replace these terms at any time. Your continued use of the service after any such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please contact us at:
                <br />
                <strong>Email:</strong> legal@inr99.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
