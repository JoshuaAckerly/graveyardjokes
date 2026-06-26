import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ServicesIntake from '../intake';

const mockSetData = vi.fn();
const mockPost = vi.fn();
const mockUseForm = vi.fn();

vi.mock('@inertiajs/react', () => ({
    Head: ({ children }: any) => <>{children}</>,
    Link: ({ href, children, className }: any) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
    useForm: (...args: any[]) => mockUseForm(...args),
}));

vi.mock('@/Layouts/MainLayout', () => ({
    __esModule: true,
    default: ({ children }: { children: any }) => <div data-testid="main-layout">{children}</div>,
}));

const baseProps = {
    prefillPackage: 'professional',
    packageOptions: [
        { value: 'starter', label: 'Starter Package' },
        { value: 'professional', label: 'Professional Package' },
        { value: 'premium', label: 'Premium Package' },
    ],
    goalOptions: [
        { value: 'lead_generation', label: 'Get leads' },
        { value: 'build_credibility', label: 'Build credibility' },
    ],
    pageOptions: [
        { value: 'home', label: 'Home' },
        { value: 'contact', label: 'Contact' },
        { value: 'services', label: 'Services' },
    ],
    featureOptions: [
        { value: 'contact_form', label: 'Contact form' },
        { value: 'analytics', label: 'Analytics setup' },
    ],
    personalityOptions: [
        { value: 'modern', label: 'Modern' },
        { value: 'bold', label: 'Bold' },
    ],
    legalPageOptions: [
        { value: 'privacy', label: 'Privacy Policy' },
        { value: 'terms', label: 'Terms of Service' },
    ],
};

describe('Services Intake Page', () => {
    beforeEach(() => {
        mockSetData.mockReset();
        mockPost.mockReset();
        mockUseForm.mockReset();

        mockUseForm.mockImplementation((initialData: any) => ({
            data: initialData,
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: {},
        }));
    });

    it('renders questionnaire sections and submit action', () => {
        render(<ServicesIntake {...baseProps} />);

        expect(screen.getByText('Website Project Questionnaire')).toBeInTheDocument();
        expect(screen.getByText('1. Contact and Package')).toBeInTheDocument();
        expect(screen.getByText('2. Project Goals')).toBeInTheDocument();
        expect(screen.getByText('6. Final Confirmation')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit and continue to payment/i })).toBeInTheDocument();
    });

    it('uses provided prefill package when valid', () => {
        render(<ServicesIntake {...baseProps} prefillPackage="premium" />);

        const initialData = mockUseForm.mock.calls[0][0] as { selected_package: string };
        expect(initialData.selected_package).toBe('premium');
    });

    it('falls back to first package option when prefill package is invalid', () => {
        render(<ServicesIntake {...baseProps} prefillPackage="unknown" />);

        const initialData = mockUseForm.mock.calls[0][0] as { selected_package: string };
        expect(initialData.selected_package).toBe('starter');
    });

    it('falls back to professional when no package options are provided', () => {
        render(<ServicesIntake {...baseProps} prefillPackage="unknown" packageOptions={[]} />);

        const initialData = mockUseForm.mock.calls[0][0] as { selected_package: string };
        expect(initialData.selected_package).toBe('professional');
    });

    it('submits to the intake endpoint with preserveScroll enabled', () => {
        render(<ServicesIntake {...baseProps} />);

        const submitButton = screen.getByRole('button', { name: /submit and continue to payment/i });
        const form = submitButton.closest('form');

        expect(form).not.toBeNull();
        fireEvent.submit(form!);

        expect(mockPost).toHaveBeenCalledWith('/services/intake', {
            preserveScroll: true,
        });
    });

    it('renders backend validation errors', () => {
        mockUseForm.mockImplementation((initialData: any) => ({
            data: initialData,
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: {
                selected_package: 'Please pick a package.',
                top_goals: 'Choose at least one goal.',
            },
        }));

        render(<ServicesIntake {...baseProps} />);

        expect(screen.getByText('Please pick a package.')).toBeInTheDocument();
        expect(screen.getByText('Choose at least one goal.')).toBeInTheDocument();
    });

    it('renders array field errors sent as dot notation', () => {
        mockUseForm.mockImplementation((initialData: any) => ({
            data: initialData,
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: {
                'top_goals.0': 'Choose at least one goal value.',
            },
        }));

        render(<ServicesIntake {...baseProps} />);

        expect(screen.getByText('Choose at least one goal value.')).toBeInTheDocument();
    });

    it('renders all supported field-level errors', () => {
        const allFieldErrors: Record<string, string> = {
            selected_package: 'Error selected package',
            full_name: 'Error full name',
            business_name: 'Error business name',
            email: 'Error email',
            phone: 'Error phone',
            project_summary: 'Error project summary',
            top_goals: 'Error top goals',
            target_audience: 'Error target audience',
            primary_call_to_action: 'Error primary call to action',
            required_pages: 'Error required pages',
            must_have_features: 'Error must-have features',
            design_references: 'Error design references',
            brand_personality: 'Error brand personality',
            has_logo: 'Error has logo',
            needs_copywriting: 'Error needs copywriting',
            content_status: 'Error content status',
            asset_status: 'Error asset status',
            domain_status: 'Error domain status',
            hosting_status: 'Error hosting status',
            needs_email_setup: 'Error needs email setup',
            needs_seo: 'Error needs seo',
            launch_date: 'Error launch date',
            budget_range: 'Error budget range',
            hard_deadline: 'Error hard deadline',
            phased_rollout_ok: 'Error phased rollout',
            legal_pages_needed: 'Error legal pages',
            integrations: 'Error integrations',
            approval_commitment: 'Error approval commitment',
            assets_commitment: 'Error assets commitment',
            feedback_commitment: 'Error feedback commitment',
            scope_acknowledged: 'Error scope acknowledged',
            timeline_acknowledged: 'Error timeline acknowledged',
            accuracy_confirmed: 'Error accuracy confirmed',
            additional_notes: 'Error additional notes',
        };

        mockUseForm.mockImplementation((initialData: any) => ({
            data: initialData,
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: allFieldErrors,
        }));

        render(<ServicesIntake {...baseProps} />);

        Object.values(allFieldErrors).forEach((message) => {
            expect(screen.getByText(message)).toBeInTheDocument();
        });
    });

    it('wires key form interactions to setData with expected values', () => {
        render(<ServicesIntake {...baseProps} />);

        fireEvent.change(screen.getByLabelText('Selected package'), { target: { value: 'starter' } });
        fireEvent.change(screen.getByLabelText('Preferred contact method'), { target: { value: 'phone' } });
        fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Jane Client' } });
        fireEvent.change(screen.getByLabelText('Business name'), { target: { value: 'Client Co' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '555-111-2222' } });
        fireEvent.change(screen.getByLabelText('What are you looking for?'), { target: { value: 'Need a new conversion-focused site.' } });
        fireEvent.change(screen.getByLabelText('Target audience'), { target: { value: 'Independent artists in Buffalo.' } });
        fireEvent.change(screen.getByLabelText('Primary visitor action'), { target: { value: 'Book a consultation' } });
        fireEvent.change(screen.getByLabelText('Design references and style notes'), { target: { value: 'Clean and modern.' } });
        fireEvent.change(screen.getByLabelText('Integrations needed'), { target: { value: 'Mailchimp' } });
        fireEvent.change(screen.getByLabelText('Additional notes'), { target: { value: 'Please prioritize launch speed.' } });

        fireEvent.click(screen.getByLabelText('Get leads'));
        fireEvent.click(screen.getByLabelText('Home'));
        fireEvent.click(screen.getByLabelText('Contact form'));
        fireEvent.click(screen.getByLabelText('Modern'));
        fireEvent.click(screen.getByLabelText('Privacy Policy'));

        fireEvent.change(screen.getByLabelText('Do you already have a logo?'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Need help writing website copy?'), { target: { value: '0' } });
        fireEvent.change(screen.getByLabelText('Text content status'), { target: { value: 'ready' } });
        fireEvent.change(screen.getByLabelText('Photos/video assets status'), { target: { value: 'need_help' } });
        fireEvent.change(screen.getByLabelText('Domain status'), { target: { value: 'owned' } });
        fireEvent.change(screen.getByLabelText('Hosting status'), { target: { value: 'owned' } });
        fireEvent.change(screen.getByLabelText('Need domain email setup?'), { target: { value: '0' } });
        fireEvent.change(screen.getByLabelText('Need SEO setup included?'), { target: { value: '0' } });
        fireEvent.change(screen.getByLabelText('Ideal launch date'), { target: { value: '2026-04-01' } });
        fireEvent.change(screen.getByLabelText('Budget range'), { target: { value: '3k_5k' } });
        fireEvent.change(screen.getByLabelText('Is your launch date a hard deadline?'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Are phased rollouts okay?'), { target: { value: '0' } });

        fireEvent.click(screen.getByLabelText(/timely approvals and decisions/i));
        fireEvent.click(screen.getByLabelText(/provide logo, copy, and media assets/i));
        fireEvent.click(screen.getByLabelText(/revision feedback within agreed timelines/i));
        fireEvent.click(screen.getByLabelText(/project scope and pricing can change/i));
        fireEvent.click(screen.getByLabelText(/timelines begin after required assets/i));
        fireEvent.click(screen.getByLabelText(/intake information is accurate/i));

        expect(mockSetData).toHaveBeenCalledWith('selected_package', 'starter');
        expect(mockSetData).toHaveBeenCalledWith('preferred_contact_method', 'phone');
        expect(mockSetData).toHaveBeenCalledWith('full_name', 'Jane Client');
        expect(mockSetData).toHaveBeenCalledWith('business_name', 'Client Co');
        expect(mockSetData).toHaveBeenCalledWith('email', 'jane@example.com');
        expect(mockSetData).toHaveBeenCalledWith('phone', '555-111-2222');
        expect(mockSetData).toHaveBeenCalledWith('project_summary', 'Need a new conversion-focused site.');
        expect(mockSetData).toHaveBeenCalledWith('target_audience', 'Independent artists in Buffalo.');
        expect(mockSetData).toHaveBeenCalledWith('primary_call_to_action', 'Book a consultation');
        expect(mockSetData).toHaveBeenCalledWith('design_references', 'Clean and modern.');
        expect(mockSetData).toHaveBeenCalledWith('integrations', 'Mailchimp');
        expect(mockSetData).toHaveBeenCalledWith('additional_notes', 'Please prioritize launch speed.');

        expect(mockSetData).toHaveBeenCalledWith('top_goals', ['lead_generation']);
        expect(mockSetData).toHaveBeenCalledWith('required_pages', ['contact']);
        expect(mockSetData).toHaveBeenCalledWith('must_have_features', ['contact_form']);
        expect(mockSetData).toHaveBeenCalledWith('brand_personality', ['modern']);
        expect(mockSetData).toHaveBeenCalledWith('legal_pages_needed', ['privacy']);

        expect(mockSetData).toHaveBeenCalledWith('has_logo', true);
        expect(mockSetData).toHaveBeenCalledWith('needs_copywriting', false);
        expect(mockSetData).toHaveBeenCalledWith('content_status', 'ready');
        expect(mockSetData).toHaveBeenCalledWith('asset_status', 'need_help');
        expect(mockSetData).toHaveBeenCalledWith('domain_status', 'owned');
        expect(mockSetData).toHaveBeenCalledWith('hosting_status', 'owned');
        expect(mockSetData).toHaveBeenCalledWith('needs_email_setup', false);
        expect(mockSetData).toHaveBeenCalledWith('needs_seo', false);
        expect(mockSetData).toHaveBeenCalledWith('launch_date', '2026-04-01');
        expect(mockSetData).toHaveBeenCalledWith('budget_range', '3k_5k');
        expect(mockSetData).toHaveBeenCalledWith('hard_deadline', true);
        expect(mockSetData).toHaveBeenCalledWith('phased_rollout_ok', false);

        expect(mockSetData).toHaveBeenCalledWith('approval_commitment', true);
        expect(mockSetData).toHaveBeenCalledWith('assets_commitment', true);
        expect(mockSetData).toHaveBeenCalledWith('feedback_commitment', true);
        expect(mockSetData).toHaveBeenCalledWith('scope_acknowledged', true);
        expect(mockSetData).toHaveBeenCalledWith('timeline_acknowledged', true);
        expect(mockSetData).toHaveBeenCalledWith('accuracy_confirmed', true);
    });

    it('shows submitting state while processing', () => {
        mockUseForm.mockImplementation((initialData: any) => ({
            data: initialData,
            setData: mockSetData,
            post: mockPost,
            processing: true,
            errors: {},
        }));

        render(<ServicesIntake {...baseProps} />);

        const button = screen.getByRole('button', { name: 'Submitting...' });
        expect(button).toBeDisabled();
    });
});
