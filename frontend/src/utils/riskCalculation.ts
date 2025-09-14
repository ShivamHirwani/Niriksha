import { Student } from '../context/StudentContext';

export interface RiskFactor {
  name: string;
  weight: number;
  threshold: {
    high: number;
    medium: number;
  };
  type: 'lower' | 'upper'; // 'lower' means lower values are riskier, 'upper' means higher values are riskier
}

export const defaultRiskFactors: RiskFactor[] = [
  {
    name: 'attendance',
    weight: 0.3,
    threshold: { high: 60, medium: 80 },
    type: 'lower'
  },
  {
    name: 'gpa',
    weight: 0.4,
    threshold: { high: 2.0, medium: 2.5 },
    type: 'lower'
  },
  {
    name: 'failedSubjects',
    weight: 0.2,
    threshold: { high: 2, medium: 1 },
    type: 'upper'
  },
  {
    name: 'exhaustedAttempts',
    weight: 0.1,
    threshold: { high: 1, medium: 0 },
    type: 'upper'
  }
];

export const calculateRiskScore = (student: Student, riskFactors: RiskFactor[] = defaultRiskFactors): number => {
  let totalScore = 0;
  let totalWeight = 0;

  riskFactors.forEach(factor => {
    let value = 0;
    let score = 0;

    switch (factor.name) {
      case 'attendance':
        value = student.attendanceRate;
        if (factor.type === 'lower') {
          if (value <= factor.threshold.high) score = 100;
          else if (value <= factor.threshold.medium) score = 60;
          else score = 20;
        }
        break;

      case 'gpa':
        value = student.currentGPA;
        if (factor.type === 'lower') {
          if (value <= factor.threshold.high) score = 100;
          else if (value <= factor.threshold.medium) score = 60;
          else score = 20;
        }
        break;

      case 'failedSubjects':
        value = student.subjects.filter(s => s.status === 'failing').length;
        if (factor.type === 'upper') {
          if (value >= factor.threshold.high) score = 100;
          else if (value >= factor.threshold.medium) score = 60;
          else score = 20;
        }
        break;

      case 'exhaustedAttempts':
        value = student.subjects.filter(s => s.attempts >= 3).length;
        if (factor.type === 'upper') {
          if (value >= factor.threshold.high) score = 100;
          else if (value >= factor.threshold.medium) score = 60;
          else score = 20;
        }
        break;
    }

    totalScore += score * factor.weight;
    totalWeight += factor.weight;
  });

  return Math.round(totalScore / totalWeight);
};

export const determineRiskLevel = (riskScore: number): 'low' | 'medium' | 'high' => {
  if (riskScore >= 70) return 'high';
  if (riskScore >= 40) return 'medium';
  return 'low';
};

export const generateRiskFactors = (student: Student): Array<{
  factor: string;
  severity: 'low' | 'medium' | 'high';
  weight: number;
}> => {
  const factors = [];

  // Attendance factor
  if (student.attendanceRate < 60) {
    factors.push({
      factor: 'Critical Attendance Issues',
      severity: 'high' as const,
      weight: 0.35
    });
  } else if (student.attendanceRate < 80) {
    factors.push({
      factor: 'Low Attendance',
      severity: 'medium' as const,
      weight: 0.25
    });
  }

  // GPA factor
  if (student.currentGPA < 2.0) {
    factors.push({
      factor: 'Poor Academic Performance',
      severity: 'high' as const,
      weight: 0.4
    });
  } else if (student.currentGPA < 2.5) {
    factors.push({
      factor: 'Below Average Performance',
      severity: 'medium' as const,
      weight: 0.3
    });
  }

  // Failed subjects
  const failedCount = student.subjects.filter(s => s.status === 'failing').length;
  if (failedCount >= 2) {
    factors.push({
      factor: 'Multiple Subject Failures',
      severity: 'high' as const,
      weight: 0.3
    });
  } else if (failedCount >= 1) {
    factors.push({
      factor: 'Subject Performance Issues',
      severity: 'medium' as const,
      weight: 0.2
    });
  }

  // Exhausted attempts
  const exhaustedCount = student.subjects.filter(s => s.attempts >= 3).length;
  if (exhaustedCount >= 1) {
    factors.push({
      factor: 'Exhausted Attempts',
      severity: 'high' as const,
      weight: 0.25
    });
  }

  // If no risk factors, add positive indicator
  if (factors.length === 0) {
    factors.push({
      factor: 'Good Academic Standing',
      severity: 'low' as const,
      weight: 0.1
    });
  }

  return factors;
};

export const predictDropoutRisk = (student: Student): {
  probability: number;
  timeframe: string;
  recommendations: string[];
} => {
  const riskScore = calculateRiskScore(student);
  
  let probability = 0;
  let timeframe = '';
  let recommendations: string[] = [];

  if (riskScore >= 80) {
    probability = 0.85;
    timeframe = 'Within 4 weeks';
    recommendations = [
      'Immediate intervention required',
      'Schedule emergency parent/guardian meeting',
      'Assign dedicated academic advisor',
      'Consider reduced course load',
      'Provide additional tutoring support'
    ];
  } else if (riskScore >= 60) {
    probability = 0.65;
    timeframe = 'Within current semester';
    recommendations = [
      'Schedule counseling session',
      'Monitor weekly progress',
      'Connect with support services',
      'Review study habits and time management'
    ];
  } else if (riskScore >= 40) {
    probability = 0.35;
    timeframe = 'Next 6 months';
    recommendations = [
      'Regular check-ins with advisor',
      'Monitor attendance patterns',
      'Encourage study group participation'
    ];
  } else {
    probability = 0.15;
    timeframe = 'Low risk';
    recommendations = [
      'Continue current support level',
      'Recognize good performance',
      'Peer mentoring opportunities'
    ];
  }

  return { probability, timeframe, recommendations };
};