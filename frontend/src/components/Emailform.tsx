import React, { useState } from 'react';
import { ArrowLeft, Send, User, Mail, MessageSquare, Clock, AlertTriangle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  riskLevel: 'High' | 'Critical';
  parentEmail: string;
  parentName: string;
  phone: string;
  attendance: number;
  gpa: number;
  lastContact: string;
}

interface EmailFormProps {
  student: Student;
  onBack: () => void;
  onSend: (emailData: EmailData) => void;
}

interface EmailData {
  subject: string;
  message: string;
  priority: 'Normal' | 'High' | 'Urgent';
  followUpDate: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ student, onBack, onSend }) => {
  const [emailData, setEmailData] = useState<EmailData>({
    subject: `Urgent: Academic Concerns for ${student.name}`,
    message: `Dear ${student.parentName},

I hope this message finds you well. I am writing to discuss some academic concerns regarding ${student.name} that require immediate attention.

Current Academic Status:
• Attendance Rate: ${student.attendance}%
• Current GPA: ${student.gpa}
• Risk Level: ${student.riskLevel}

${student.riskLevel === 'Critical'
        ? `${student.name} is currently at critical risk of not meeting graduation requirements. Immediate intervention is necessary to help get them back on track.`
        : `While ${student.name} is showing some concerning patterns, with proper support and intervention, we can help improve their academic performance.`
      }

I would like to schedule a meeting with you to discuss:
1. Strategies to improve attendance and engagement
2. Additional academic support resources available
3. A personalized action plan for ${student.name}
4. Ways we can work together to support their success

Please let me know your availability for a meeting this week. You can reach me at this email or by phone during school hours.

Thank you for your partnership in ${student.name}'s education.

Best regards,
[Your Name]
[Your Title]
[School Name]
[Contact Information]`,
    priority: student.riskLevel === 'Critical' ? 'Urgent' : 'High',
    followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 days from now
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    onSend(emailData);
    setIsLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    return riskLevel === 'Critical'
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-orange-100 text-orange-800 border-orange-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Send Parent Communication</h1>
              <p className="text-gray-600 mt-1">Compose email regarding student academic concerns</p>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">Student ID: {student.id}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskBadgeColor(student.riskLevel)}`}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {student.riskLevel} Risk
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.parentName}</p>
                  <p className="text-xs text-gray-500">Parent/Guardian</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.parentEmail}</p>
                  <p className="text-xs text-gray-500">Email Address</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(student.lastContact).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">Last Contact</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Email Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-900">{student.parentName}</p>
                  <p className="text-sm text-gray-600">{student.parentEmail}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={emailData.priority}
                  onChange={(e) => setEmailData({ ...emailData, priority: e.target.value as EmailData['priority'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(emailData.priority)}`}>
                    {emailData.priority} Priority
                  </span>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                rows={12}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Enter your message"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {emailData.message.length} characters
              </p>
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Reminder Date
              </label>
              <input
                type="date"
                value={emailData.followUpDate}
                onChange={(e) => setEmailData({ ...emailData, followUpDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Set a reminder to follow up on this communication
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg text-white font-medium transition-all ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;
