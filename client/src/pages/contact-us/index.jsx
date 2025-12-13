import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/Header';
import WhatsAppButton from '../../components/WhatsAppButton';
import Footer from '../home-page/components/Footer';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    materialType: '',
    quantity: '',
    projectTimeline: '',
    message: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const contactMethods = [
    {
      icon: 'Phone',
      title: 'Phone',
      primary: '+91 98765 43210',
      secondary: '+91 98765 43211',
      action: 'tel:+919876543210',
    },
    {
      icon: 'MessageCircle',
      title: 'WhatsApp',
      primary: '+91 98765 43210',
      secondary: 'Quick Response 24/7',
      action: 'https://wa.me/919876543210',
    },
    {
      icon: 'Mail',
      title: 'Email',
      primary: 'sales@constructhubpro.com',
      secondary: 'support@constructhubpro.com',
      action: 'mailto:sales@constructhubpro.com',
    },
    {
      icon: 'MapPin',
      title: 'Location',
      primary: '123, Industrial Area, Sector 18',
      secondary: 'Mumbai, Maharashtra 400001',
      action: 'https://maps.google.com',
    },
  ];

  const businessHours = [
    { day: 'Monday - Saturday', hours: '8:00 AM - 8:00 PM' },
    { day: 'Sunday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Emergency Contact', hours: '24/7 Available' },
  ];

  const faqs = [
    {
      question: 'What are your delivery charges?',
      answer: 'Delivery charges vary based on location and order quantity. Free delivery for orders above ₹50,000 within city limits.',
    },
    {
      question: 'Do you provide bulk discounts?',
      answer: 'Yes, we offer attractive discounts on bulk orders. Contact our sales team for customized pricing.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cash, bank transfer, UPI, credit cards, and provide credit facilities for regular customers.',
    },
    {
      question: 'Do you deliver on weekends?',
      answer: 'Yes, we provide delivery services on weekends. Sunday deliveries may have additional charges.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - ConstructHub Pro</title>
        <meta
          name="description"
          content="Get in touch with ConstructHub Pro for construction material inquiries, bulk orders, or any assistance. We're here to help!"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-16">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
                <p className="text-lg md:text-xl opacity-90">
                  Have questions? We're here to help you with all your construction material needs
                </p>
              </div>
            </div>
          </section>

          {/* Contact Methods Section */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 text-center">Get In Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {contactMethods?.map((method, index) => (
                  <a
                    key={index}
                    href={method?.action}
                    target={method?.icon === 'MapPin' ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="bg-card rounded-lg shadow-elevation-1 border border-border p-6 hover:shadow-elevation-2 transition-micro"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon name={method?.icon} size={24} color="var(--color-primary)" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{method?.title}</h3>
                    <p className="text-sm text-foreground mb-1">{method?.primary}</p>
                    <p className="text-sm text-muted-foreground">{method?.secondary}</p>
                  </a>
                ))}
              </div>

              {/* Contact Form and Map */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="bg-card rounded-lg shadow-elevation-1 border border-border p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Your Name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData?.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData?.email}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData?.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Material Type"
                      name="materialType"
                      placeholder="e.g., Cement, TMT Bars, Sand"
                      value={formData?.materialType}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Quantity Required"
                      name="quantity"
                      placeholder="e.g., 100 bags, 2 tons"
                      value={formData?.quantity}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Project Timeline"
                      name="projectTimeline"
                      placeholder="e.g., Within 1 week"
                      value={formData?.projectTimeline}
                      onChange={handleInputChange}
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Tell us about your requirements..."
                        value={formData?.message}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      fullWidth
                      iconName="Send"
                      iconPosition="right"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>

                {/* Map and Business Hours */}
                <div className="space-y-6">
                  {/* Map */}
                  <div className="bg-card rounded-lg shadow-elevation-1 border border-border overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <div className="text-center p-8">
                        <Icon name="MapPin" size={48} color="var(--color-muted-foreground)" />
                        <p className="mt-4 text-muted-foreground">Interactive Map View</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          123, Industrial Area, Sector 18<br />
                          Mumbai, Maharashtra 400001
                        </p>
                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 text-primary hover:underline"
                        >
                          Open in Google Maps →
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="bg-card rounded-lg shadow-elevation-1 border border-border p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Icon name="Clock" size={20} color="var(--color-primary)" />
                      Business Hours
                    </h3>
                    <div className="space-y-3">
                      {businessHours?.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <span className="text-muted-foreground">{schedule?.day}</span>
                          <span className="font-semibold text-foreground">{schedule?.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick WhatsApp */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-elevation-1 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
                    <p className="mb-4 opacity-90">Chat with us on WhatsApp for instant assistance</p>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-md font-semibold hover:bg-green-50 transition-micro"
                    >
                      <Icon name="MessageCircle" size={20} />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12 md:py-20 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-12 text-center">
                Frequently Asked Questions
              </h2>
              <div className="max-w-3xl mx-auto space-y-4">
                {faqs?.map((faq, index) => (
                  <div key={index} className="bg-card rounded-lg shadow-elevation-1 border border-border p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2 flex items-start gap-2">
                      <Icon name="HelpCircle" size={20} color="var(--color-primary)" className="mt-1" />
                      {faq?.question}
                    </h3>
                    <p className="text-muted-foreground ml-7">{faq?.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Social Media Links */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="bg-card rounded-lg shadow-elevation-1 border border-border p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Connect With Us</h3>
                <p className="text-muted-foreground mb-6">Follow us on social media for updates and offers</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-micro"
                  >
                    <Icon name="Facebook" size={20} color="var(--color-primary)" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-micro"
                  >
                    <Icon name="Instagram" size={20} color="var(--color-primary)" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-micro"
                  >
                    <Icon name="Linkedin" size={20} color="var(--color-primary)" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-micro"
                  >
                    <Icon name="Twitter" size={20} color="var(--color-primary)" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default ContactUs;