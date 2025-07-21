'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { HiOutlineDocumentText, HiOutlineUser, HiOutlineExclamation, HiOutlineClipboardList, HiOutlineCalendar, HiOutlineCurrencyDollar, HiOutlineLocationMarker, HiOutlineHome, HiOutlineMail } from 'react-icons/hi';

export default function TestModalPage() {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isFullWidthModalOpen, setIsFullWidthModalOpen] = useState(false);
  const [isTopModalOpen, setIsTopModalOpen] = useState(false);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [isRobustModalOneOpen, setIsRobustModalOneOpen] = useState(false);
  const [isRobustModalTwoOpen, setIsRobustModalTwoOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8" style={{ fontFamily: 'Avenir, sans-serif' }}>
      <h1 className="text-2xl font-bold mb-8">Modal Component Examples</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Modal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Modal</h2>
          <button
            onClick={() => setIsBasicModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Open Basic Modal
          </button>
          <Modal
            isOpen={isBasicModalOpen}
            onClose={() => setIsBasicModalOpen(false)}
            title="Basic Modal"
            description="This is a basic modal with a title and description."
            className="font-avenir"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-xs">
                This is the content of the basic modal. You can put any content here.
              </p>
            </div>
          </Modal>
        </div>

        {/* Icon Modal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Icon Modal</h2>
          <button
            onClick={() => setIsIconModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Open Icon Modal
          </button>
          <Modal
            isOpen={isIconModalOpen}
            onClose={() => setIsIconModalOpen(false)}
            title="Icon Modal"
            description="This modal includes an icon in the header."
            icon={<HiOutlineDocumentText className="w-6 h-6 text-primary" />}
            className="font-avenir"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-xs">
                This modal demonstrates how to include an icon in the header.
              </p>
            </div>
          </Modal>
        </div>

        {/* Alert Modal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Alert Modal</h2>
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Open Alert Modal
          </button>
          <Modal
            isOpen={isAlertModalOpen}
            onClose={() => setIsAlertModalOpen(false)}
            title="Delete Account"
            description="Are you sure you want to delete your account? This action cannot be undone."
            icon={<HiOutlineExclamation className="w-6 h-6 text-red-500" />}
            className="font-avenir"
            footer={
              <>
                <button
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                >
                  Delete Account
                </button>
              </>
            }
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-xs">
                This modal demonstrates how to create an alert or confirmation dialog with custom footer buttons.
              </p>
            </div>
          </Modal>
        </div>

        {/* Full Width Modal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Full Width Modal</h2>
          <button
            onClick={() => setIsFullWidthModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Open Full Width Modal
          </button>
          <Modal
            isOpen={isFullWidthModalOpen}
            onClose={() => setIsFullWidthModalOpen(false)}
            title="Full Width Modal"
            description="This modal takes up the full width of the screen."
            size="full"
            className="font-avenir"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Column 1</h3>
                <p className="text-gray-600 text-xs">This is the first column of the full-width modal.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Column 2</h3>
                <p className="text-gray-600 text-xs">This is the second column of the full-width modal.</p>
              </div>
            </div>
          </Modal>
        </div>

        {/* Top Position Modal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Position Modal</h2>
          <button
            onClick={() => setIsTopModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Open Top Modal
          </button>
          <Modal
            isOpen={isTopModalOpen}
            onClose={() => setIsTopModalOpen(false)}
            title="Top Position Modal"
            description="This modal appears at the top of the screen."
            position="top"
            icon={<HiOutlineUser className="w-6 h-6 text-primary" />}
            className="font-avenir"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-xs">
                This modal demonstrates how to position the modal at the top of the screen.
              </p>
            </div>
          </Modal>
        </div>

        {/* Bottom Position Modal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Bottom Position Modal</h2>
          <button
            onClick={() => setIsBottomModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Open Bottom Modal
          </button>
          <Modal
            isOpen={isBottomModalOpen}
            onClose={() => setIsBottomModalOpen(false)}
            title="Bottom Position Modal"
            description="This modal appears at the bottom of the screen."
            position="bottom"
            icon={<HiOutlineUser className="w-6 h-6 text-primary" />}
            className="font-avenir"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-xs">
                This modal demonstrates how to position the modal at the bottom of the screen.
              </p>
            </div>
          </Modal>
        </div>

        {/* Robust Modal One - Contract Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Robust Modal One</h2>
          <button
            onClick={() => setIsRobustModalOneOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Open Contract Details Modal
          </button>
          <Modal
            isOpen={isRobustModalOneOpen}
            onClose={() => setIsRobustModalOneOpen(false)}
            title="Contract Details"
            description="View and manage contract information"
            size="xl"
            icon={<HiOutlineDocumentText className="w-6 h-6 text-primary" />}
            className="font-avenir"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Contract Details Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Contract Details</h3>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                      <div className="text-xs text-black">#9548</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Contract Type</div>
                      <div className="text-xs text-black">Property Sale</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Status</div>
                      <div className="text-xs text-black">Active</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Created Date</div>
                      <div className="text-xs text-black">May 15, 2024</div>
                    </div>
                  </div>
                </div>

                {/* Property Details Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Property Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Property Address</div>
                      <div className="text-xs text-black">123 Main Street, Los Angeles, CA 90001</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Property Type</div>
                      <div className="text-xs text-black">Residential</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Property Value</div>
                      <div className="text-xs text-black">$750,000</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Parties Involved Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Parties Involved</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Buyer</div>
                      <div className="text-xs text-black">John Smith</div>
                      <div className="text-xs text-gray-500">john.smith@email.com</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Seller</div>
                      <div className="text-xs text-black">Jane Doe</div>
                      <div className="text-xs text-gray-500">jane.doe@email.com</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Agent</div>
                      <div className="text-xs text-black">Michael Brown</div>
                      <div className="text-xs text-gray-500">michael.brown@email.com</div>
                    </div>
                  </div>
                </div>

                {/* Timeline Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Closing Date</div>
                      <div className="text-xs text-black">June 30, 2024</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Due Date</div>
                      <div className="text-xs text-black">June 15, 2024</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Last Updated</div>
                      <div className="text-xs text-black">May 20, 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>

        {/* Robust Modal Two - Task Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Robust Modal Two</h2>
          <button
            onClick={() => setIsRobustModalTwoOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Open Task Details Modal
          </button>
          <Modal
            isOpen={isRobustModalTwoOpen}
            onClose={() => setIsRobustModalTwoOpen(false)}
            title="Task Details"
            description="View and manage task information"
            size="xl"
            icon={<HiOutlineClipboardList className="w-6 h-6 text-primary" />}
            className="font-avenir"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Task Details Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Task Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Task ID</div>
                      <div className="text-xs text-black">TSK-003</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Title</div>
                      <div className="text-xs text-black">Verify Payment Schedule</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Description</div>
                      <div className="text-xs text-black">Review and confirm all payment milestones and schedules.</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Status</div>
                      <div className="text-xs text-black">In Progress</div>
                    </div>
                  </div>
                </div>

                {/* Progress Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Current Progress</div>
                      <div className="text-xs text-black">1 of 2 steps completed</div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '50%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Due Date</div>
                      <div className="text-xs text-black">May 20, 2024</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Assignment Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Assignment</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Assigned To</div>
                      <div className="text-xs text-black">Michael Brown</div>
                      <div className="text-xs text-gray-500">michael.brown@email.com</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Department</div>
                      <div className="text-xs text-black">Legal</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Priority</div>
                      <div className="text-xs text-black">High</div>
                    </div>
                  </div>
                </div>

                {/* Related Contract Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Related Contract</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Contract ID</div>
                      <div className="text-xs text-black">#9548</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Contract Name</div>
                      <div className="text-xs text-black">New Property Acquisition</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Contract Type</div>
                      <div className="text-xs text-black">Property Sale</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
} 