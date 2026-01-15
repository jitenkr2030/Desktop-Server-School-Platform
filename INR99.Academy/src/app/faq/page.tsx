import { NewNavigation } from "@/components/new-navigation"

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "Browse our course catalog, select a course you're interested in, and click the 'Enroll Now' button. You'll need to create an account or log in if you haven't already. Payment can be made via credit card, debit card, or net banking."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, net banking, and UPI. For institutional purchases, we also offer invoice-based payments."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, contact our support team within 30 days of enrollment for a full refund."
    },
    {
      question: "How long do I have access to a course?",
      answer: "Once enrolled, you have lifetime access to the course content. This includes all future updates and new material added to the course."
    },
    {
      question: "Do I get a certificate after completing a course?",
      answer: "Yes! Upon successfully completing all lessons and assessments in a course, you'll receive a digital certificate that you can download and share on LinkedIn."
    },
    {
      question: "Can I download course videos for offline viewing?",
      answer: "Yes, our mobile app allows you to download videos for offline viewing. This feature is especially useful when you're traveling or have limited internet access."
    },
    {
      question: "What if I have questions during the course?",
      answer: "Each course has a dedicated discussion forum where you can ask questions. Our instructors and teaching assistants typically respond within 24 hours. You can also schedule one-on-one sessions with instructors for premium courses."
    },
    {
      question: "Are there any prerequisites for the courses?",
      answer: "Most of our beginner courses have no prerequisites. Advanced courses may require basic knowledge of the subject. Check the course description for specific requirements."
    },
    {
      question: "Can I switch to a different batch or schedule?",
      answer: "Our courses are self-paced, so you can start anytime and learn at your own speed. Live sessions are recorded, so you can watch them later if you miss the live class."
    },
    {
      question: "How do I become an instructor?",
      answer: "We're always looking for passionate educators! Visit our 'Careers' page or contact us at instructors@inr99.com to learn about our instructor application process."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Find answers to common questions about our courses, payments, and more.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-11">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a 
            href="/contact" 
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
