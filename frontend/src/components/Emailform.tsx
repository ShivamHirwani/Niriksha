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
      case 'Urgent': return { backgroundColor: 'var(--color-danger-bg-dark, #fee2e2)', color: 'var(--color-danger-dark, #dc2626)', borderColor: 'var(--color-danger-600, #dc2626)' };
      case 'High': return { backgroundColor: 'var(--color-warning-bg-dark, #fef3c7)', color: 'var(--color-warning-dark, #d97706)', borderColor: 'var(--color-warning-600, #d97706)' };
      default: return { backgroundColor: 'var(--color-info-bg-dark, #cffafe)', color: 'var(--color-info-dark, #0891b2)', borderColor: 'var(--color-info-600, #0891b2)' };
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    return riskLevel === 'Critical'
      ? { backgroundColor: 'var(--color-danger-bg-dark, #fee2e2)', color: 'var(--color-danger-dark, #dc2626)', borderColor: 'var(--color-danger-600, #dc2626)' }
      : { backgroundColor: 'var(--color-warning-bg-dark, #fef3c7)', color: 'var(--color-warning-dark, #d97706)', borderColor: 'var(--color-warning-600, #d97706)' };
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="rounded-xl shadow-sm border p-6 mb-8" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Send Parent Communication</h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Compose email regarding student academic concerns</p>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <span className="text-white font-medium">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{student.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Student ID: {student.id}</p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border" style={getRiskBadgeColor(student.riskLevel)}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {student.riskLevel} Risk
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{student.parentName}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Parent/Guardian</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{student.parentEmail}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Email Address</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {new Date(student.lastContact).toLocaleDateString()}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last Contact</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="rounded-xl shadow-sm border p-6" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
          <div className="space-y-6">
            {/* Email Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  To
                </label>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{student.parentName}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{student.parentEmail}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Priority Level
                </label>
                <select
                  value={emailData.priority}
                  onChange={(e) => setEmailData({ ...emailData, priority: e.target.value as EmailData['priority'] })}
                  className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--color-primary-500)'
                  } as React.CSSProperties}
                >
                  <option value="Normal" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Normal</option>
                  <option value="High" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>High</option>
                  <option value="Urgent" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>Urgent</option>
                </select>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border" style={getPriorityColor(emailData.priority)}>
                    {emailData.priority} Priority
                  </span>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Subject
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--color-primary-500)'
                } as React.CSSProperties}
                placeholder="Enter email subject"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Message
              </label>
              <textarea
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                rows={12}
                className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none resize-vertical"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--color-primary-500)'
                } as React.CSSProperties}
                placeholder="Enter your message"
                required
              />
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                {emailData.message.length} characters
              </p>
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Follow-up Reminder Date
              </label>
              <input
                type="date"
                value={emailData.followUpDate}
                onChange={(e) => setEmailData({ ...emailData, followUpDate: e.target.value })}
                className="w-full p-3 rounded-lg focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--color-primary-500)'
                } as React.CSSProperties}
                required
              />
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Set a reminder to follow up on this communication
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 rounded-lg transition-colors font-medium"
                style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg transition-colors font-medium"
                  style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${isLoading
                    ? 'cursor-not-allowed'
                    : 'text-white hover:shadow-md active:transform active:scale-95'
                    }`}
                  style={{
                    background: isLoading 
                      ? 'var(--bg-tertiary)' 
                      : 'var(--gradient-primary)',
                    color: isLoading 
                      ? 'var(--text-muted)' 
                      : 'var(--text-inverse)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--text-inverse)' }} />
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