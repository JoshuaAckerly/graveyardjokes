import MainLayout from '@/Layouts/MainLayout';
import { trackFormSubmission, trackPackageSelection } from '@/hooks/use-google-analytics';
import InertiaHead from '@/Components/InertiaHead';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';

type IntakeOption = {
    value: string;
    label: string;
};

type IntakePageProps = {
    prefillPackage: string;
    packageOptions: IntakeOption[];
    goalOptions: IntakeOption[];
    pageOptions: IntakeOption[];
    featureOptions: IntakeOption[];
    personalityOptions: IntakeOption[];
    legalPageOptions: IntakeOption[];
};

type CheckboxField = 'top_goals' | 'required_pages' | 'must_have_features' | 'brand_personality' | 'legal_pages_needed';

type IntakeFormData = {
    selected_package: string;
    full_name: string;
    business_name: string;
    email: string;
    phone: string;
    preferred_contact_method: string;
    project_summary: string;
    top_goals: string[];
    target_audience: string;
    primary_call_to_action: string;
    required_pages: string[];
    must_have_features: string[];
    design_references: string;
    brand_personality: string[];
    has_logo: boolean;
    content_status: string;
    asset_status: string;
    needs_copywriting: boolean;
    legal_pages_needed: string[];
    domain_status: string;
    hosting_status: string;
    needs_email_setup: boolean;
    integrations: string;
    needs_seo: boolean;
    launch_date: string;
    budget_range: string;
    hard_deadline: boolean;
    phased_rollout_ok: boolean;
    approval_commitment: boolean;
    assets_commitment: boolean;
    feedback_commitment: boolean;
    scope_acknowledged: boolean;
    timeline_acknowledged: boolean;
    accuracy_confirmed: boolean;
    additional_notes: string;
};

const contactMethodOptions: IntakeOption[] = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'text', label: 'Text message' },
];

const statusOptions: IntakeOption[] = [
    { value: 'ready', label: 'Ready now' },
    { value: 'partial', label: 'Partially ready' },
    { value: 'need_help', label: 'Need help creating this' },
];

const budgetOptions: IntakeOption[] = [
    { value: 'under_1k', label: 'Under $1,000' },
    { value: '1k_3k', label: '$1,000 - $3,000' },
    { value: '3k_5k', label: '$3,000 - $5,000' },
    { value: '5k_plus', label: '$5,000+' },
];

function boolToSelectValue(value: boolean): '1' | '0' {
    return value ? '1' : '0';
}

function selectValueToBool(value: string): boolean {
    return value === '1';
}

export default function ServicesIntake({
    prefillPackage,
    packageOptions,
    goalOptions,
    pageOptions,
    featureOptions,
    personalityOptions,
    legalPageOptions,
}: IntakePageProps) {
    const hasPrefillPackage = packageOptions.some((option) => option.value === prefillPackage);
    const defaultPackage = hasPrefillPackage ? prefillPackage : (packageOptions[0]?.value ?? 'professional');

    const { data, setData, post, processing, errors } = useForm<IntakeFormData>({
        selected_package: defaultPackage,
        full_name: '',
        business_name: '',
        email: '',
        phone: '',
        preferred_contact_method: 'email',
        project_summary: '',
        top_goals: [],
        target_audience: '',
        primary_call_to_action: '',
        required_pages: ['home', 'contact'],
        must_have_features: [],
        design_references: '',
        brand_personality: [],
        has_logo: false,
        content_status: 'partial',
        asset_status: 'partial',
        needs_copywriting: true,
        legal_pages_needed: [],
        domain_status: 'need_help',
        hosting_status: 'need_help',
        needs_email_setup: true,
        integrations: '',
        needs_seo: true,
        launch_date: '',
        budget_range: '1k_3k',
        hard_deadline: false,
        phased_rollout_ok: true,
        approval_commitment: false,
        assets_commitment: false,
        feedback_commitment: false,
        scope_acknowledged: false,
        timeline_acknowledged: false,
        accuracy_confirmed: false,
        additional_notes: '',
    });

    const errorMap = errors as Record<string, string | undefined>;

    const toggleArrayValue = (field: CheckboxField, value: string) => {
        const currentValues = data[field];

        if (currentValues.includes(value)) {
            setData(
                field,
                currentValues.filter((currentValue) => currentValue !== value),
            );
            return;
        }

        setData(field, [...currentValues, value]);
    };

    const getFieldError = (field: string): string | undefined => errorMap[field] ?? errorMap[`${field}.0`];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Track intake form submission and package selection
        trackFormSubmission('intake_form', {
            package: data.selected_package,
        });
        trackPackageSelection(data.selected_package);

        post('/services/intake', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <InertiaHead />

            <MainLayout>
                <div className="mx-auto max-w-5xl px-4 py-8 text-white">
                    <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-white transition hover:text-(--primary)">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Services
                    </Link>

                    <div className="rounded-lg border-2 border-(--accent) bg-(--card) p-6 sm:p-8">
                        <h1 className="text-3xl font-bold">Website Project Questionnaire</h1>
                        <p className="mt-3 text-sm text-white/80 sm:text-base">
                            Complete this before payment so we can scope your build correctly. After submission, payment is unlocked for the selected
                            package.
                        </p>

                        <form onSubmit={submit} className="mt-8 space-y-8">
                            <section className="space-y-4 rounded-lg border border-white/10 p-4 sm:p-6">
                                <h2 className="text-xl font-semibold">1. Contact and Package</h2>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="selected_package" className="mb-1 block text-sm font-medium">
                                            Selected package
                                        </label>
                                        <select
                                            id="selected_package"
                                            value={data.selected_package}
                                            onChange={(event) => setData('selected_package', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                            required
                                        >
                                            {packageOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {getFieldError('selected_package') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('selected_package')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="preferred_contact_method" className="mb-1 block text-sm font-medium">
                                            Preferred contact method
                                        </label>
                                        <select
                                            id="preferred_contact_method"
                                            value={data.preferred_contact_method}
                                            onChange={(event) => setData('preferred_contact_method', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            {contactMethodOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="full_name" className="mb-1 block text-sm font-medium">
                                            Full name
                                        </label>
                                        <input
                                            id="full_name"
                                            value={data.full_name}
                                            onChange={(event) => setData('full_name', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                            required
                                        />
                                        {getFieldError('full_name') && <p className="mt-1 text-sm text-red-300">{getFieldError('full_name')}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="business_name" className="mb-1 block text-sm font-medium">
                                            Business name
                                        </label>
                                        <input
                                            id="business_name"
                                            value={data.business_name}
                                            onChange={(event) => setData('business_name', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        />
                                        {getFieldError('business_name') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('business_name')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="mb-1 block text-sm font-medium">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                            required
                                        />
                                        {getFieldError('email') && <p className="mt-1 text-sm text-red-300">{getFieldError('email')}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                                            Phone
                                        </label>
                                        <input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(event) => setData('phone', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        />
                                        {getFieldError('phone') && <p className="mt-1 text-sm text-red-300">{getFieldError('phone')}</p>}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4 rounded-lg border border-white/10 p-4 sm:p-6">
                                <h2 className="text-xl font-semibold">2. Project Goals</h2>

                                <div>
                                    <label htmlFor="project_summary" className="mb-1 block text-sm font-medium">
                                        What are you looking for?
                                    </label>
                                    <textarea
                                        id="project_summary"
                                        rows={4}
                                        value={data.project_summary}
                                        onChange={(event) => setData('project_summary', event.target.value)}
                                        className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        required
                                    />
                                    {getFieldError('project_summary') && (
                                        <p className="mt-1 text-sm text-red-300">{getFieldError('project_summary')}</p>
                                    )}
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium">Top goals (choose at least one)</p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {goalOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-2 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.top_goals.includes(option.value)}
                                                    onChange={() => toggleArrayValue('top_goals', option.value)}
                                                    className="mt-1"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {getFieldError('top_goals') && <p className="mt-1 text-sm text-red-300">{getFieldError('top_goals')}</p>}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="target_audience" className="mb-1 block text-sm font-medium">
                                            Target audience
                                        </label>
                                        <textarea
                                            id="target_audience"
                                            rows={3}
                                            value={data.target_audience}
                                            onChange={(event) => setData('target_audience', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                            required
                                        />
                                        {getFieldError('target_audience') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('target_audience')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="primary_call_to_action" className="mb-1 block text-sm font-medium">
                                            Primary visitor action
                                        </label>
                                        <input
                                            id="primary_call_to_action"
                                            value={data.primary_call_to_action}
                                            onChange={(event) => setData('primary_call_to_action', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                            placeholder="Example: Book a consultation"
                                            required
                                        />
                                        {getFieldError('primary_call_to_action') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('primary_call_to_action')}</p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4 rounded-lg border border-white/10 p-4 sm:p-6">
                                <h2 className="text-xl font-semibold">3. Scope and Features</h2>

                                <div>
                                    <p className="mb-2 text-sm font-medium">Required pages</p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {pageOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-2 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.required_pages.includes(option.value)}
                                                    onChange={() => toggleArrayValue('required_pages', option.value)}
                                                    className="mt-1"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {getFieldError('required_pages') && (
                                        <p className="mt-1 text-sm text-red-300">{getFieldError('required_pages')}</p>
                                    )}
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium">Must-have features</p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {featureOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-2 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.must_have_features.includes(option.value)}
                                                    onChange={() => toggleArrayValue('must_have_features', option.value)}
                                                    className="mt-1"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {getFieldError('must_have_features') && (
                                        <p className="mt-1 text-sm text-red-300">{getFieldError('must_have_features')}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="design_references" className="mb-1 block text-sm font-medium">
                                        Design references and style notes
                                    </label>
                                    <textarea
                                        id="design_references"
                                        rows={4}
                                        value={data.design_references}
                                        onChange={(event) => setData('design_references', event.target.value)}
                                        className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        placeholder="Share websites you like and what you like about them."
                                    />
                                    {getFieldError('design_references') && (
                                        <p className="mt-1 text-sm text-red-300">{getFieldError('design_references')}</p>
                                    )}
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium">Brand personality</p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {personalityOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-2 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.brand_personality.includes(option.value)}
                                                    onChange={() => toggleArrayValue('brand_personality', option.value)}
                                                    className="mt-1"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {getFieldError('brand_personality') && (
                                        <p className="mt-1 text-sm text-red-300">{getFieldError('brand_personality')}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="has_logo" className="mb-1 block text-sm font-medium">
                                            Do you already have a logo?
                                        </label>
                                        <select
                                            id="has_logo"
                                            value={boolToSelectValue(data.has_logo)}
                                            onChange={(event) => setData('has_logo', selectValueToBool(event.target.value))}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                        {getFieldError('has_logo') && <p className="mt-1 text-sm text-red-300">{getFieldError('has_logo')}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="needs_copywriting" className="mb-1 block text-sm font-medium">
                                            Need help writing website copy?
                                        </label>
                                        <select
                                            id="needs_copywriting"
                                            value={boolToSelectValue(data.needs_copywriting)}
                                            onChange={(event) => setData('needs_copywriting', selectValueToBool(event.target.value))}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                        {getFieldError('needs_copywriting') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('needs_copywriting')}</p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4 rounded-lg border border-white/10 p-4 sm:p-6">
                                <h2 className="text-xl font-semibold">4. Content, Tech, and Timeline</h2>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="content_status" className="mb-1 block text-sm font-medium">
                                            Text content status
                                        </label>
                                        <select
                                            id="content_status"
                                            value={data.content_status}
                                            onChange={(event) => setData('content_status', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {getFieldError('content_status') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('content_status')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="asset_status" className="mb-1 block text-sm font-medium">
                                            Photos/video assets status
                                        </label>
                                        <select
                                            id="asset_status"
                                            value={data.asset_status}
                                            onChange={(event) => setData('asset_status', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {getFieldError('asset_status') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('asset_status')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="domain_status" className="mb-1 block text-sm font-medium">
                                            Domain status
                                        </label>
                                        <select
                                            id="domain_status"
                                            value={data.domain_status}
                                            onChange={(event) => setData('domain_status', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            <option value="owned">Already owned</option>
                                            <option value="need_help">Need help setting it up</option>
                                        </select>
                                        {getFieldError('domain_status') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('domain_status')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="hosting_status" className="mb-1 block text-sm font-medium">
                                            Hosting status
                                        </label>
                                        <select
                                            id="hosting_status"
                                            value={data.hosting_status}
                                            onChange={(event) => setData('hosting_status', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            <option value="owned">Already owned</option>
                                            <option value="need_help">Need help setting it up</option>
                                        </select>
                                        {getFieldError('hosting_status') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('hosting_status')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="needs_email_setup" className="mb-1 block text-sm font-medium">
                                            Need domain email setup?
                                        </label>
                                        <select
                                            id="needs_email_setup"
                                            value={boolToSelectValue(data.needs_email_setup)}
                                            onChange={(event) => setData('needs_email_setup', selectValueToBool(event.target.value))}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                        {getFieldError('needs_email_setup') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('needs_email_setup')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="needs_seo" className="mb-1 block text-sm font-medium">
                                            Need SEO setup included?
                                        </label>
                                        <select
                                            id="needs_seo"
                                            value={boolToSelectValue(data.needs_seo)}
                                            onChange={(event) => setData('needs_seo', selectValueToBool(event.target.value))}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                        {getFieldError('needs_seo') && <p className="mt-1 text-sm text-red-300">{getFieldError('needs_seo')}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="launch_date" className="mb-1 block text-sm font-medium">
                                            Ideal launch date
                                        </label>
                                        <input
                                            id="launch_date"
                                            type="date"
                                            value={data.launch_date}
                                            onChange={(event) => setData('launch_date', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        />
                                        {getFieldError('launch_date') && <p className="mt-1 text-sm text-red-300">{getFieldError('launch_date')}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="budget_range" className="mb-1 block text-sm font-medium">
                                            Budget range
                                        </label>
                                        <select
                                            id="budget_range"
                                            value={data.budget_range}
                                            onChange={(event) => setData('budget_range', event.target.value)}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            {budgetOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {getFieldError('budget_range') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('budget_range')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="hard_deadline" className="mb-1 block text-sm font-medium">
                                            Is your launch date a hard deadline?
                                        </label>
                                        <select
                                            id="hard_deadline"
                                            value={boolToSelectValue(data.hard_deadline)}
                                            onChange={(event) => setData('hard_deadline', selectValueToBool(event.target.value))}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                        {getFieldError('hard_deadline') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('hard_deadline')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phased_rollout_ok" className="mb-1 block text-sm font-medium">
                                            Are phased rollouts okay?
                                        </label>
                                        <select
                                            id="phased_rollout_ok"
                                            value={boolToSelectValue(data.phased_rollout_ok)}
                                            onChange={(event) => setData('phased_rollout_ok', selectValueToBool(event.target.value))}
                                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        >
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                        {getFieldError('phased_rollout_ok') && (
                                            <p className="mt-1 text-sm text-red-300">{getFieldError('phased_rollout_ok')}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium">Legal pages needed</p>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {legalPageOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-2 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.legal_pages_needed.includes(option.value)}
                                                    onChange={() => toggleArrayValue('legal_pages_needed', option.value)}
                                                    className="mt-1"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {getFieldError('legal_pages_needed') && (
                                        <p className="mt-1 text-sm text-red-300">{getFieldError('legal_pages_needed')}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="integrations" className="mb-1 block text-sm font-medium">
                                        Integrations needed
                                    </label>
                                    <textarea
                                        id="integrations"
                                        rows={3}
                                        value={data.integrations}
                                        onChange={(event) => setData('integrations', event.target.value)}
                                        className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                        placeholder="Examples: Stripe, PayPal, Mailchimp, CRM, booking tool"
                                    />
                                    {getFieldError('integrations') && <p className="mt-1 text-sm text-red-300">{getFieldError('integrations')}</p>}
                                </div>
                            </section>

                            <section className="space-y-4 rounded-lg border border-white/10 p-4 sm:p-6">
                                <h2 className="text-xl font-semibold">5. What I Need From You</h2>

                                <div className="space-y-3 text-sm">
                                    <label className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-3">
                                        <input
                                            type="checkbox"
                                            checked={data.approval_commitment}
                                            onChange={(event) => setData('approval_commitment', event.target.checked)}
                                            required
                                            className="mt-1"
                                        />
                                        <span>I can provide timely approvals and decisions during the project.</span>
                                    </label>
                                    {getFieldError('approval_commitment') && (
                                        <p className="text-sm text-red-300">{getFieldError('approval_commitment')}</p>
                                    )}

                                    <label className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-3">
                                        <input
                                            type="checkbox"
                                            checked={data.assets_commitment}
                                            onChange={(event) => setData('assets_commitment', event.target.checked)}
                                            required
                                            className="mt-1"
                                        />
                                        <span>I will provide logo, copy, and media assets when requested.</span>
                                    </label>
                                    {getFieldError('assets_commitment') && (
                                        <p className="text-sm text-red-300">{getFieldError('assets_commitment')}</p>
                                    )}

                                    <label className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-3">
                                        <input
                                            type="checkbox"
                                            checked={data.feedback_commitment}
                                            onChange={(event) => setData('feedback_commitment', event.target.checked)}
                                            required
                                            className="mt-1"
                                        />
                                        <span>I can provide revision feedback within agreed timelines.</span>
                                    </label>
                                    {getFieldError('feedback_commitment') && (
                                        <p className="text-sm text-red-300">{getFieldError('feedback_commitment')}</p>
                                    )}
                                </div>
                            </section>

                            <section className="space-y-4 rounded-lg border border-white/10 p-4 sm:p-6">
                                <h2 className="text-xl font-semibold">6. Final Confirmation</h2>

                                <div className="space-y-3 text-sm">
                                    <label className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-3">
                                        <input
                                            type="checkbox"
                                            checked={data.scope_acknowledged}
                                            onChange={(event) => setData('scope_acknowledged', event.target.checked)}
                                            required
                                            className="mt-1"
                                        />
                                        <span>I understand project scope and pricing can change if requirements change.</span>
                                    </label>
                                    {getFieldError('scope_acknowledged') && (
                                        <p className="text-sm text-red-300">{getFieldError('scope_acknowledged')}</p>
                                    )}

                                    <label className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-3">
                                        <input
                                            type="checkbox"
                                            checked={data.timeline_acknowledged}
                                            onChange={(event) => setData('timeline_acknowledged', event.target.checked)}
                                            required
                                            className="mt-1"
                                        />
                                        <span>I understand timelines begin after required assets and access are provided.</span>
                                    </label>
                                    {getFieldError('timeline_acknowledged') && (
                                        <p className="text-sm text-red-300">{getFieldError('timeline_acknowledged')}</p>
                                    )}

                                    <label className="flex items-start gap-2 rounded border border-white/10 bg-black/20 p-3">
                                        <input
                                            type="checkbox"
                                            checked={data.accuracy_confirmed}
                                            onChange={(event) => setData('accuracy_confirmed', event.target.checked)}
                                            required
                                            className="mt-1"
                                        />
                                        <span>I confirm this intake information is accurate.</span>
                                    </label>
                                    {getFieldError('accuracy_confirmed') && (
                                        <p className="text-sm text-red-300">{getFieldError('accuracy_confirmed')}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="additional_notes" className="mb-1 block text-sm font-medium">
                                        Additional notes
                                    </label>
                                    <textarea
                                        id="additional_notes"
                                        rows={4}
                                        value={data.additional_notes}
                                        onChange={(event) => setData('additional_notes', event.target.value)}
                                        className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2"
                                    />
                                    {getFieldError('additional_notes') && (
                                        <p className="mt-1 text-sm text-red-300">{getFieldError('additional_notes')}</p>
                                    )}
                                </div>
                            </section>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-white/70">Submitting this form unlocks payment for your selected package.</p>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center rounded-md bg-(--primary) px-6 py-3 font-semibold text-white transition hover:bg-(--accent) disabled:opacity-60"
                                >
                                    {processing ? 'Submitting...' : 'Submit and Continue to Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
