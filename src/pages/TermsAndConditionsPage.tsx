const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen bg-mono-light dark:bg-mono-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-mono-dark dark:text-mono-light mb-8 text-center">
          Terms and Conditions
        </h1>

        <div className="bg-mono-light-800 dark:bg-mono-dark-800 p-8 rounded-lg border-2 border-mono-light-400 dark:border-mono-dark-400 shadow-card space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Acceptance of Terms
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              By accessing and using this website, you accept and agree to be
              bound by these Terms and Conditions. If you do not agree to these
              terms, please do not use our website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              User Accounts
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              When you create an account with us, you guarantee that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-dark-600 dark:text-mono-light-600 ml-4">
              <li>The information you provide is accurate and complete</li>
              <li>You will maintain the accuracy of such information</li>
              <li>You are 18 years or older</li>
              <li>
                Your use of the service will not violate any applicable laws
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Products and Pricing
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              All product descriptions and prices are subject to change without
              notice. We reserve the right to modify or discontinue any product
              at any time. We do not warrant that the quality of any products
              purchased will meet your expectations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Order Acceptance and Pricing
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              We reserve the right to refuse any order placed with us. We may,
              at our sole discretion, limit or cancel quantities purchased per
              person, per household, or per order. Prices for our products are
              subject to change without notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Payment Terms
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              We accept various forms of payment as indicated on our website. By
              providing payment information, you represent and warrant that you
              have the legal right to use any payment method(s) you provide.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Shipping and Delivery
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              Delivery times are estimates only. We are not responsible for any
              delays caused by shipping carriers or customs. Risk of loss and
              title for items purchased pass to you upon delivery of the items
              to the carrier.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Returns and Refunds
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              Our return and refund policy is valid for 30 days from the date of
              purchase. To be eligible for a return, your item must be unused
              and in the same condition that you received it, with all original
              packaging.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Intellectual Property
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              All content on this website, including text, graphics, logos,
              images, and software, is our property and is protected by
              copyright and other intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Limitation of Liability
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              We shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of our
              services or products.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Contact Information
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              Questions about these Terms and Conditions should be sent to us at{" "}
              <a
                href="mailto:legal@laceup.com"
                className="text-mono-dark dark:text-mono-light underline"
              >
                legal@laceup.com
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-mono-dark dark:text-mono-light">
              Changes to Terms
            </h2>
            <p className="text-mono-dark-600 dark:text-mono-light-600">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting to the website. Your
              continued use of the website constitutes acceptance of these
              changes.
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

export default TermsAndConditionsPage;
