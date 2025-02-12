const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-mono-light dark:bg-mono-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-mono-dark dark:text-mono-light mb-8 text-center">
          Privacy Policy
        </h1>

        <div className="bg-mono-light-800 dark:bg-mono-dark-800 p-8 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Information We Collect
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              We collect information you provide directly to us, including name,
              email address, shipping address, and payment information when you
              make a purchase. We also automatically collect certain information
              about your device when you use our website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              How We Use Your Information
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-dark-600 dark:text-mono-light-600 ml-4">
              <li>Process your orders and payments</li>
              <li>Send you order confirmations and updates</li>
              <li>Respond to your questions and requests</li>
              <li>Improve our website and services</li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Cookies and Tracking
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              We use cookies and similar tracking technologies to track activity
              on our website and collect certain information. Cookies are files
              with a small amount of data that may include an anonymous unique
              identifier.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Data Security
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              We implement appropriate security measures to protect your
              personal information. However, please note that no method of
              transmission over the internet or electronic storage is 100%
              secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Your Rights
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-dark-600 dark:text-mono-light-600 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to our use of your data</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Contact Us
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              If you have any questions about our Privacy Policy, please contact
              us at{" "}
              <a
                href="mailto:privacy@laceup.com"
                className="text-mono-dark dark:text-mono-light underline"
              >
                privacy@laceup.com
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Updates to This Policy
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last Updated" date.
            </p>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
