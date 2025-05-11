import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-gray-700 mb-4">
            At SpendIt, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our financial tracking application.
          </p>
          <p className="text-gray-700">
            Please read this privacy policy carefully. If you do not agree with
            the terms of this privacy policy, please do not access the
            application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Personal Information</h3>
              <p className="text-gray-700">
                We may collect personal information that you voluntarily provide
                to us when you register for the SpendIt application, such as
                your name and email address.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">
                Financial Information
              </h3>
              <p className="text-gray-700">
                To provide our core services, we collect financial information
                that you input into the application, including:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Expense data and categories</li>
                <li>Subscription information</li>
                <li>Loan details</li>
                <li>Income information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Usage Data</h3>
              <p className="text-gray-700">
                We may automatically collect certain information about how you
                interact with our application, including:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Device information (type, operating system)</li>
                <li>Log data (IP address, access times)</li>
                <li>Application feature usage patterns</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide, maintain, and improve the SpendIt application</li>
            <li>Process and complete transactions</li>
            <li>Generate financial insights and recommendations</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>
              Detect, investigate, and prevent fraudulent transactions and other
              illegal activities
            </li>
            <li>Protect the rights and property of SpendIt and our users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to
            protect the security of your personal information. However, please
            be aware that no method of transmission over the internet or
            electronic storage is 100% secure.
          </p>
          <p className="text-gray-700">
            Your financial data is encrypted both in transit and at rest. We
            regularly review our security practices to ensure the highest level
            of protection for your sensitive information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Data Sharing and Disclosure
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell your personal information to third parties. We may
            share your information in the following situations:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>With Service Providers:</strong> We may share your
              information with third-party vendors who provide services on our
              behalf.
            </li>
            <li>
              <strong>For Legal Reasons:</strong> We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information
              with your consent or at your direction.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              The right to access the personal information we have about you
            </li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your personal information</li>
            <li>
              The right to restrict or object to processing of your personal
              information
            </li>
            <li>The right to data portability</li>
          </ul>
          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us using the information
            provided in the "Contact Us" section.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
          <p className="text-gray-700">
            We will retain your personal information only for as long as
            necessary to fulfill the purposes outlined in this Privacy Policy,
            unless a longer retention period is required or permitted by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <div className="text-gray-700">
            <p>Email: privacy@spendit.com</p>
            <p>
              Address: 123 Financial Street, Suite 100, Money City, MC 12345
            </p>
          </div>
        </section>

        <div className="border-t pt-6 mt-8">
          <p className="text-gray-500 text-sm">Last Updated: May 11, 2025</p>
          <div className="mt-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
