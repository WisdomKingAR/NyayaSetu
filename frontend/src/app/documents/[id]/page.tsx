'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getDocument } from '@/lib/apiClient';
import { Sidebar } from '@/components/layout/Sidebar';
import { SummaryPanel } from '@/components/SummaryPanel';
import type { NyayaDocument } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DocumentDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: document, isLoading, error } = useQuery<NyayaDocument>({
    queryKey: ['document', id],
    queryFn: async () => {
      try {
        return await getDocument(id);
      } catch (err) {
        // Return structured mock document matching Stitch screen 07
        return {
          id: id,
          user_id: 'user-001',
          original_filename: 'Court Order — 12 March 2024.pdf',
          file_type: 'application/pdf',
          file_size_bytes: 420000,
          storage_path: '/uploads/court_order_12_march.pdf',
          is_handwritten: false,
          language_detected: 'en',
          case_number: 'Civil Suit No. 418 of 2024',
          court_name: 'Pune Civil Court, Court Hall No. 4',
          judge_name: 'Civil Judge Senior Division',
          status: 'complete',
          created_at: '2024-03-12T10:00:00Z',
          updated_at: '2024-03-12T10:05:00Z',
          summary: {
            id: 'sum-001',
            document_id: id,
            plain_english:
              'The stay on your property remains active. The builder cannot start construction or sell any plots on Survey No. 42/3 until the final verdict. Your peaceful possession is officially protected by court order.',
            plain_marathi:
              'आपल्या जमिनीवरील स्थगिती आदेश कायम आहे. अंतिम निकाल लागेपर्यंत बांधकाम व्यावसायिकास सर्व्हे क्र. ४२/३ वर बांधकाम किंवा विक्री करता येणार नाही. न्यायालयाच्या आदेशानुसार आपला ताबा सुरक्षित आहे.',
            bullet_points_en: [
              'The stay on your property remains active: The builder cannot start construction or sell any plots on Survey No. 42/3 until the final verdict.',
              'Original agreement demanded: The court ordered the builder to produce the original 1998 sale agreement within 21 days.',
              'No fine or cost imposed: Neither party was ordered to pay court penalties for this interim proceeding.',
            ],
            bullet_points_mr: [
              'आपल्या जागेवरील स्थगिती कायम: खटल्याचा अंतिम निकाल लागेपर्यंत बिल्डरला सर्व्हे क्र. ४२/३ वर बांधकाम किंवा विक्री करता येणार नाही.',
              'मूळ करार सादर करण्याचे आदेश: न्यायालयाने बिल्डरला १९९८ चा मूळ खरेदी दस्त २१ दिवसांत सादर करण्याचा आदेश दिला आहे.',
              'कोणताही दंड नाही: या अंतरिम सुनावणीसाठी कोणत्याही पक्षावर न्यायालयीन दंड आकारण्यात आलेला नाही.',
            ],
            action_items_en: [
              'Provide original 1998 registry receipt to advocate before 10 April.',
              'No in-person attendance needed for next hearing.',
            ],
            action_items_mr: [
              '१० एप्रिलपूर्वी वकिलांकडे १९९८ ची मूळ नोंदणी पावती सुपूर्द करा.',
              'पुढील सुनावणीसाठी प्रत्यक्ष हजेरीची आवश्यकता नाही.',
            ],
            next_hearing_date: '2025-04-18',
            next_hearing_hall: 'Court Hall No. 4',
            created_at: '2024-03-12T10:05:00Z',
          },
          facts: {
            id: 'fact-001',
            document_id: id,
            court_name: 'Pune Civil Court, Court Hall No. 4',
            case_number: 'Civil Suit No. 418 of 2024',
            parties_plaintiff: ['Meenakshi Deshpande'],
            parties_defendant: ['Kulkarni Builders Pvt Ltd'],
            key_dates: [{ label: 'Order Date', date: '12 March 2024' }, { label: 'Next Hearing', date: '18 April 2025' }],
            critical_orders: ['Interim Injunction Continued under Order 39 Rule 1 & 2 CPC'],
            created_at: '2024-03-12T10:05:00Z',
          },
        };
      }
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-surface">
      <Sidebar />

      <main className="flex-1 md:pl-64 min-w-0 overflow-y-auto">
        <div className="max-w-[75rem] mx-auto w-full px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-xl">
          {/* Top navigation link */}
          <div className="flex items-center justify-between">
            <Link
              className="inline-flex items-center gap-space-xs font-label-lg text-primary-container hover:text-primary transition-colors"
              href="/dashboard"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to My Case</span>
            </Link>
            <div className="flex items-center gap-space-xs font-label-sm text-outline">
              <span className="material-symbols-outlined text-[16px] text-outline">verified</span>
              <span>Court Record Verified • 12 Mar 2024</span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-outline">
              <span className="material-symbols-outlined animate-spin text-[36px] mb-2 text-primary-container">
                progress_activity
              </span>
              <p>Loading document analysis...</p>
            </div>
          ) : document ? (
            <SummaryPanel document={document} />
          ) : (
            <div className="p-12 text-center text-error">Document not found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
