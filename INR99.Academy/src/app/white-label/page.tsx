import type { Metadata } from "next";
import Link from "next/link";
import { 
  Palette, 
  Globe, 
  Users, 
  Settings, 
  Shield, 
  Zap,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Star,
  Menu,
  X
} from "lucide-react";

export const metadata: Metadata = {
  title: "White-Label Learning Platform | INR99 Academy",
  description: "Launch your branded learning platform in minutes. Complete white-label solution with custom domains, dynamic branding, and multi-tenant architecture.",
};

export default function WhiteLabelLandingPage() {
  const features = [
    {
      icon: Palette,
      title: "Dynamic Branding",
      description: "Complete control over colors, fonts, logos, and custom CSS. Every element reflects your brand identity.",
      details: [
        "Primary, secondary & accent colors",
        "Custom font families",
        "Logo & favicon management",
        "Custom CSS injection",
        "Social media assets",
        "Login page branding"
      ]
    },
    {
      icon: Globe,
      title: "Subdomain Management",
      description: "Automatic subdomain provisioning with DNS and SSL management. Your own domain in minutes.",
      details: [
        "Auto-provisioned subdomains",
        "Cloudflare & Route53 integration",
        "Automatic SSL certificates",
        "Custom domain support",
        "DNS record management",
        "Multi-domain configurations"
      ]
    },
    {
      icon: Users,
      title: "Multi-Tenant Architecture",
      description: "Robust isolation between organizations with dedicated resources and configurations.",
      details: [
        "Complete tenant isolation",
        "Subscription tiers",
        "Role-based access control",
        "Session management",
        "Data privacy compliance",
        "Scalable infrastructure"
      ]
    },
    {
      icon: Settings,
      title: "Content Customization",
      description: "Adapt platform content to your context with overrides, custom fields, and localized experiences.",
      details: [
        "Content overrides",
        "Custom registration fields",
        "Welcome messages",
        "Custom policies",
        "Localization support",
        "Brand guidelines enforcement"
      ]
    },
    {
      icon: Shield,
      title: "Feature Control",
      description: "Enable or disable features based on your needs. Control analytics, certificates, discussions, and more.",
      details: [
        "Feature flags per tenant",
        "Course configuration",
        "Analytics settings",
        "Certificate management",
        "Discussion controls",
        "Live session toggles"
      ]
    },
    {
      icon: Zap,
      title: "API & Integration",
      description: "Comprehensive APIs for deep integrations with your existing systems and workflows.",
      details: [
        "RESTful API endpoints",
        "Webhook support",
        "SSO integration",
        "LMS compatibility",
        "Analytics exports",
        "Custom integrations"
      ]
    }
  ];

  const benefits = [
    {
      title: "Launch in Minutes",
      description: "Get your branded learning platform running in under 30 minutes with automated setup.",
      stat: "30 min"
    },
    {
      title: "Zero Infrastructure",
      description: "No servers to manage, no DNS to configure, no SSL to install. We handle everything.",
      stat: "0"
    },
    {
      title: "Brand Consistency",
      description: "Every touchpoint reflects your brand, from emails to certificates to login pages.",
      stat: "100%"
    },
    {
      title: "Enterprise Ready",
      description: "Built for scale with multi-tenant isolation, compliance features, and premium support.",
      stat: "99.9%"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Register Your Organization",
      description: "Sign up and choose your subdomain. We'll verify your details and set up your platform.",
      action: "Start Registration"
    },
    {
      step: "02",
      title: "Customize Your Brand",
      description: "Upload your logo, set your colors, and configure fonts. Preview changes in real-time.",
      action: "Configure Branding"
    },
    {
      step: "03",
      title: "Invite Your Users",
      description: "Set up registration preferences and invite your first users to start learning.",
      action: "Setup Users"
    },
    {
      step: "04",
      title: "Launch & Grow",
      description: "Go live and scale your platform. Monitor analytics and optimize as you grow.",
      action: "Launch Now"
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "₹999",
      period: "/month",
      description: "Perfect for small organizations getting started",
      features: [
        "Up to 100 users",
        "Custom subdomain",
        "Full branding suite",
        "Basic analytics",
        "Email support",
        "Course management"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "₹4,999",
      period: "/month",
      description: "For growing organizations with advanced needs",
      features: [
        "Up to 2,000 users",
        "Custom domain",
        "Advanced customization",
        "Full analytics suite",
        "Priority support",
        "API access",
        "Custom integrations"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations requiring maximum flexibility",
      features: [
        "Unlimited users",
        "White-label solution",
        "Dedicated infrastructure",
        "Custom development",
        "24/7 phone support",
        "SLA guarantee",
        "On-premise option"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const testimonials = [
    {
      quote: "INR99 Academy's white-label platform helped us launch our corporate training portal in just 2 weeks. The branding controls are incredible.",
      author: "Priya Sharma",
      role: "Head of Learning, TechCorp India",
      avatar: "PS"
    },
    {
      quote: "The multi-tenant architecture lets us serve multiple schools from one platform while keeping each school's data completely isolated.",
      author: "Rajesh Kumar",
      role: "CTO, EduFirst Schools",
      avatar: "RK"
    },
    {
      quote: "Custom domains and automatic SSL provisioning saved us weeks of technical work. Our branded portal went live in under an hour.",
      author: "Anita Desai",
      role: "Founder, LearnHub Academy",
      avatar: "AD"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to set up a white-label platform?",
      answer: "With automated provisioning, your platform can be ready in under 30 minutes. This includes subdomain creation, DNS configuration, and SSL certificate issuance. Custom branding can be configured in real-time through the admin dashboard."
    },
    {
      question: "Can I use my own domain instead of a subdomain?",
      answer: "Yes! Professional and Enterprise plans include custom domain support. You can configure your own domain (e.g., learning.yourcompany.com) through our DNS integration or by updating your DNS records manually."
    },
    {
      question: "How does tenant isolation work?",
      answer: "Our multi-tenant architecture enforces strict isolation at multiple levels. Database queries are scoped to tenant context, file storage is partitioned by tenant, and session management prevents cross-tenant access. This ensures complete data privacy between organizations."
    },
    {
      question: "What customizations are available?",
      answer: "You can customize colors (primary, secondary, accent), fonts, logos, favicon, login page background, social sharing images, and inject custom CSS. Enterprise plans also include custom domain, white-label mobile apps, and custom development capabilities."
    },
    {
      question: "Do you provide technical support?",
      answer: "All plans include email support. Professional plans add priority chat support. Enterprise plans include 24/7 phone support, dedicated account manager, and SLA-backed guarantees with guaranteed response times."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">₹</span>
              </div>
              <span className="text-xl font-bold text-gray-900">INR99 Academy</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">Benefits</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link href="#contact" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>White-Label Learning Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Launch Your Branded<br />
            <span className="text-blue-600">Learning Platform</span> in Minutes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Complete white-label solution with custom domains, dynamic branding, 
            multi-tenant architecture, and enterprise-grade features. No infrastructure 
            management required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#contact" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="#features" className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center justify-center">
              Explore Features
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>30-minute setup</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span>Free subdomain included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your <span className="text-blue-600">White-Label Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help organizations create branded learning 
              experiences that engage learners and drive results.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <feature.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our <span className="text-blue-600">White-Label Solution</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for organizations that need professional learning platforms without 
              the complexity of building from scratch.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-blue-600 mb-2">{benefit.stat}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your branded learning platform up and running in four simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow h-full">
                  <div className="text-6xl font-bold text-blue-100 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  <button className="text-blue-600 font-medium flex items-center hover:underline">
                    {step.action}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-blue-600">Leading Organizations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers say about building their white-label learning platforms.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent <span className="text-blue-600">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include our core white-label features.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl p-8 ${plan.popular ? 'border-2 border-blue-600 shadow-xl' : 'border border-gray-100'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? We have answers.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Launch Your Branded Learning Platform?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of organizations that trust INR99 Academy for their white-label learning needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg">
              Start Free Trial
            </button>
            <button className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors">
              Schedule Demo
            </button>
          </div>
          <p className="mt-6 text-blue-200 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">₹</span>
                </div>
                <span className="text-xl font-bold text-white">INR99 Academy</span>
              </div>
              <p className="text-sm">
                Empowering organizations with white-label learning solutions since 2024.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2024 INR99 Academy. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
