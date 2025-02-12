import { Link } from "react-router-dom";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "John Smith",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Sarah Johnson",
      role: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Michael Chen",
      role: "Lead Developer",
      image:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-mono-light dark:bg-mono-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-mono-dark dark:text-mono-light mb-4">
            About LaceUp
          </h1>
          <p className="text-mono-dark-600 dark:text-mono-light-600 max-w-2xl mx-auto text-lg">
            Redefining the sneaker shopping experience with premium quality
            footwear and exceptional service.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-mono-dark dark:text-mono-light">
              Our Story
            </h2>
            <div className="space-y-4 text-mono-dark-600 dark:text-mono-light-600">
              <p>
                Founded in 2023, LaceUp began with a simple mission: to provide
                sneaker enthusiasts with a premium shopping experience and
                access to the finest footwear collections.
              </p>
              <p>
                What started as a small passion project has grown into a trusted
                destination for sneaker lovers worldwide. We take pride in our
                carefully curated selection and our commitment to authenticity
                and quality.
              </p>
              <p>
                Today, we continue to expand our collection while maintaining
                the personal touch and attention to detail that has been our
                hallmark since day one.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-card">
            <img
              src="https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Our store"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-mono-dark dark:text-mono-light text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality",
                description:
                  "We carefully select each product to ensure the highest quality standards.",
              },
              {
                title: "Authenticity",
                description:
                  "Every sneaker in our collection is 100% authentic and verified.",
              },
              {
                title: "Service",
                description:
                  "We're committed to providing exceptional customer service at every step.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-mono-light-800 dark:bg-mono-dark-800 p-8 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card"
              >
                <h3 className="text-xl font-semibold text-mono-dark dark:text-mono-light mb-4">
                  {value.title}
                </h3>
                <p className="text-mono-dark-600 dark:text-mono-light-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-mono-dark dark:text-mono-light text-center mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-mono-light-800 dark:bg-mono-dark-800 p-8 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card text-center"
              >
                <div className="w-32 h-32 mx-auto mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-mono-dark dark:text-mono-light mb-2">
                  {member.name}
                </h3>
                <p className="text-mono-dark-600 dark:text-mono-light-600">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-mono-dark dark:text-mono-light mb-6">
            Ready to Shop?
          </h2>
          <p className="text-mono-dark-600 dark:text-mono-light-600 mb-8">
            Explore our latest collection of premium sneakers.
          </p>
          <Link
            to="/category/all"
            className="inline-block px-8 py-4 bg-mono-dark dark:bg-mono-light text-mono-light dark:text-mono-dark rounded-lg font-semibold hover:bg-mono-dark-800 dark:hover:bg-mono-light-800 transition-all duration-300 border-2 border-mono-dark dark:border-mono-light shadow-button hover:shadow-button-hover"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
