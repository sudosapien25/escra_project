'use client';

import React, { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { FileUpload } from '@/components/common/FileUpload';
import { useFormValidation, commonValidations } from '@/components/common/FormValidation';

export default function TestFormsPage() {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    website: '',
    
    // Contract Details
    contractType: '',
    milestoneTemplate: '',
    contractValue: '',
    dueDate: '',
    propertyAddress: '',
    notes: '',
    
    // Contact Information
    buyer: '',
    buyerEmail: '',
    seller: '',
    sellerEmail: '',
    agent: '',
    agentEmail: '',
    
    // Financial Details
    earnestMoney: '',
    downPayment: '',
    loanAmount: '',
    interestRate: '',
    
    // Company Information
    lenderName: '',
    titleCompany: '',
    insuranceCompany: '',
    closingDate: '',
    
    // Additional Information
    contingencies: '',
    files: [] as File[],
  });

  const validationRules = {
    // Basic Information
    name: { required: true, minLength: 2 },
    email: { ...commonValidations.email, required: true },
    phone: commonValidations.phone,
    website: commonValidations.url,
    
    // Contract Details
    contractType: { required: true },
    milestoneTemplate: { required: true },
    contractValue: { ...commonValidations.currency, required: true },
    dueDate: { ...commonValidations.date, required: true },
    propertyAddress: { required: true, minLength: 5 },
    
    // Contact Information
    buyer: { required: true },
    buyerEmail: { ...commonValidations.email, required: true },
    seller: { required: true },
    sellerEmail: { ...commonValidations.email, required: true },
    agentEmail: commonValidations.email,
    
    // Financial Details
    earnestMoney: { ...commonValidations.currency, required: true },
    downPayment: { ...commonValidations.currency, required: true },
    loanAmount: { ...commonValidations.currency, required: true },
    interestRate: { ...commonValidations.number, required: true },
    
    // Company Information
    lenderName: { required: true },
    titleCompany: { required: true },
    insuranceCompany: { required: true },
    closingDate: { ...commonValidations.date, required: true },
    
    // Additional Information
    contingencies: { required: true, minLength: 10 },
  };

  const { errors, validateForm, validateFieldOnChange } = useFormValidation(validationRules);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateFieldOnChange(name, value);
  };

  const handleFileChange = (files: File[]) => {
    setFormData(prev => ({ ...prev, files }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(formData)) {
      console.log('Form submitted:', formData);
    }
  };

  const contractTypeOptions = [
    { value: 'propertySale', label: 'Property Sale' },
    { value: 'commercialLease', label: 'Commercial Lease' },
    { value: 'constructionEscrow', label: 'Construction Escrow' },
    { value: 'investmentProperty', label: 'Investment Property' },
  ];

  const milestoneTemplateOptions = [
    { value: 'standard', label: 'Standard (6 milestones)' },
    { value: 'simple', label: 'Simple (4 milestones)' },
    { value: 'construction', label: 'Construction (8 milestones)' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Form Components Test Page</h1>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                helperText="Optional"
              />
              <Input
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
                helperText="Optional"
              />
            </div>
          </section>

          {/* Contract Details Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Contract Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <Select
                label="Contract Type"
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                options={contractTypeOptions}
                placeholder="Select a contract type"
                error={errors.contractType}
                required
              />
              <Select
                label="Milestone Template"
                name="milestoneTemplate"
                value={formData.milestoneTemplate}
                onChange={handleChange}
                options={milestoneTemplateOptions}
                placeholder="Select a milestone template"
                error={errors.milestoneTemplate}
                required
              />
              <Input
                label="Contract Value"
                name="contractValue"
                type="text"
                value={formData.contractValue}
                onChange={handleChange}
                error={errors.contractValue}
                required
              />
              <Input
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                error={errors.dueDate}
                required
              />
            </div>
            <div className="mt-6">
              <Input
                label="Property Address"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                error={errors.propertyAddress}
                required
              />
            </div>
            <div className="mt-6">
              <Textarea
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                helperText="Optional"
              />
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Buyer / Client"
                name="buyer"
                value={formData.buyer}
                onChange={handleChange}
                error={errors.buyer}
                required
              />
              <Input
                label="Buyer Email"
                name="buyerEmail"
                type="email"
                value={formData.buyerEmail}
                onChange={handleChange}
                error={errors.buyerEmail}
                required
              />
              <Input
                label="Seller"
                name="seller"
                value={formData.seller}
                onChange={handleChange}
                error={errors.seller}
                required
              />
              <Input
                label="Seller Email"
                name="sellerEmail"
                type="email"
                value={formData.sellerEmail}
                onChange={handleChange}
                error={errors.sellerEmail}
                required
              />
              <Input
                label="Agent / Escrow Officer"
                name="agent"
                value={formData.agent}
                onChange={handleChange}
                helperText="Optional"
              />
              <Input
                label="Agent Email"
                name="agentEmail"
                type="email"
                value={formData.agentEmail}
                onChange={handleChange}
                error={errors.agentEmail}
                helperText="Optional"
              />
            </div>
          </section>

          {/* Financial Details Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Financial Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Earnest Money"
                name="earnestMoney"
                type="text"
                value={formData.earnestMoney}
                onChange={handleChange}
                error={errors.earnestMoney}
                required
              />
              <Input
                label="Down Payment"
                name="downPayment"
                type="text"
                value={formData.downPayment}
                onChange={handleChange}
                error={errors.downPayment}
                required
              />
              <Input
                label="Loan Amount"
                name="loanAmount"
                type="text"
                value={formData.loanAmount}
                onChange={handleChange}
                error={errors.loanAmount}
                required
              />
              <Input
                label="Interest Rate (%)"
                name="interestRate"
                type="text"
                value={formData.interestRate}
                onChange={handleChange}
                error={errors.interestRate}
                required
              />
            </div>
          </section>

          {/* Company Information Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Company Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Lender Name"
                name="lenderName"
                value={formData.lenderName}
                onChange={handleChange}
                error={errors.lenderName}
                required
              />
              <Input
                label="Title Company"
                name="titleCompany"
                value={formData.titleCompany}
                onChange={handleChange}
                error={errors.titleCompany}
                required
              />
              <Input
                label="Insurance Company"
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleChange}
                error={errors.insuranceCompany}
                required
              />
              <Input
                label="Expected Closing Date"
                name="closingDate"
                type="date"
                value={formData.closingDate}
                onChange={handleChange}
                error={errors.closingDate}
                required
              />
            </div>
          </section>

          {/* Additional Information Section */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Additional Information</h2>
            <div className="space-y-6">
              <Textarea
                label="Contingencies"
                name="contingencies"
                value={formData.contingencies}
                onChange={handleChange}
                error={errors.contingencies}
                required
              />
              <FileUpload
                label="Upload Documents"
                onChange={handleFileChange}
                helperText="Upload any relevant documents (PDF, DOC, DOCX, JPG)"
                multiple
              />
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors text-base"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 