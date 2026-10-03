'use client';

import React, { useState } from 'react';
import { User, Job, AuditLog, ModerationStatus, UserStatus } from '@/lib/types';
import {
  ShieldCheck,
  Activity,
  Users,
  Briefcase,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Lock,
  Search,
  Database,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  metrics: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    totalInterviews: number;
    totalUsers: number;
    totalSeekers: number;
    totalEmployers: number;
    avgMatchScore: number;
    databaseType: string;
    systemHealth: string;
  };
  users: Array<User & { profile?: { fullName?: string }; company?: { name?: string } }>;
  jobs: Job[];
  auditLogs: AuditLog[];
  onModerateJob: (jobId: string, status: ModerationStatus) => Promise<void>;
  onUpdateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
  onDeleteJob: (jobId: string) => Promise<void>;
}

export default function AdminDashboard({
  metrics,
  users,
  jobs,
  auditLogs,
  onModerateJob,
  onUpdateUserStatus,
  onDeleteJob,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'audit'>('moderation');
  const [searchAudit, setSearchAudit] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (searchAudit) {
      const q = searchAudit.toLowerCase();
      const matchEmail = log.actorEmail.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchEntity = log.entityType.toLowerCase().includes(q);
      if (!matchEmail && !matchAction && !matchEntity) return false;
    }
    if (filterAction !== 'ALL' && !log.action.includes(filterAction)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">System & Moderation Console</h2>
              <span className="text-xs px-2 py-0.5 bg-neutral-100 font-mono text-neutral-700 rounded">
                Admin Role Active
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Supervise job moderation, user authorization, and compliance audit logs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-neutral-50 p-2 px-3 rounded-lg border border-neutral-200">
          <Database className="w-4 h-4 text-neutral-600" />
          <span className="text-neutral-700">{metrics.databaseType}</span>
          <span className="text-neutral-300">|</span>
          <span className="text-emerald-700 font-semibold">{metrics.systemHealth}</span>
        </div>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Active Job Listings</span>
            <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {metrics.activeJobs}
          </span>
          <span className="text-[11px] text-neutral-400 block mt-0.5">out of {metrics.totalJobs} total</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Total Candidates</span>
            <Users className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {metrics.totalSeekers}
          </span>
          <span className="text-[11px] text-neutral-400 block mt-0.5">{metrics.totalEmployers} employers</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Total Applications</span>
            <Activity className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {metrics.totalApplications}
          </span>
          <span className="text-[11px] text-neutral-400 block mt-0.5">{metrics.totalInterviews} interviews</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Average Match Score</span>
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {metrics.avgMatchScore}%
          </span>
          <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">High precision algorithm</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl max-w-lg">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'moderation'
              ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Job Moderation ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'users'
              ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'audit'
              ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Compliance Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: JOB MODERATION */}
      {activeTab === 'moderation' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Job Title & Company</th>
                  <th className="py-3 px-4">Location / Remote</th>
                  <th className="py-3 px-4">Salary Band</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Moderation Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-neutral-900">
                      <div className="font-semibold text-neutral-900">{job.title}</div>
                      <div className="text-[11px] text-neutral-500">{job.company?.name || 'Company'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      {job.isRemote ? 'Worldwide Remote' : job.location}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-700">
                      ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">
                      {job.status}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          job.moderationStatus === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-800'
                            : job.moderationStatus === 'FLAGGED'
                            ? 'bg-red-50 text-red-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {job.moderationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {job.moderationStatus !== 'APPROVED' && (
                          <button
                            onClick={() => onModerateJob(job.id, 'APPROVED')}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Approve Listing"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {job.moderationStatus !== 'FLAGGED' && (
                          <button
                            onClick={() => onModerateJob(job.id, 'FLAGGED')}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded"
                            title="Flag for Review"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteJob(job.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Member Since</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-neutral-900">
                      {u.profile?.fullName || u.company?.name || u.email.split('@')[0]}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-red-50 text-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.status === 'ACTIVE' ? (
                        <button
                          onClick={() => onUpdateUserStatus(u.id, 'SUSPENDED')}
                          className="px-2.5 py-1 text-[11px] font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateUserStatus(u.id, 'ACTIVE')}
                          className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLIANCE AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchAudit}
                onChange={(e) => setSearchAudit(e.target.value)}
                placeholder="Search audit actions, emails, or entities..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Filter Event:</span>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="text-xs p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg"
              >
                <option value="ALL">All Events</option>
                <option value="JOB">Job Events</option>
                <option value="USER">User Events</option>
                <option value="APPLICATION">Application Events</option>
                <option value="INTERVIEW">Interview Events</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Actor Email</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/60">
                    <td className="py-2.5 px-3 tabular-nums text-neutral-500 whitespace-nowrap">
                      {new Date(log.createdAt).toISOString().replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-neutral-900">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600">
                      {log.entityType} ({log.entityId.substring(0, 10)})
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">
                      {log.actorEmail}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500 truncate max-w-xs">
                      {JSON.stringify(log.details || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
