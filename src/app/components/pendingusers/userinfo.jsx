"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import MaxContainer from "../common/maxcontainer";
import Image from "next/image";

const UserProfileForm = ({ user }) => {
  return user ? (
    <MaxContainer>
      <div className="max-w-6xl mx-auto p-[6rem] bg-white">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <Image
                src="/home/offa_logo.svg"
                alt="User"
                className="rounded-full mr-2"
                height={400}
                width={400}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-[1rem]">User Status</h2>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="status" className="w-4 h-4 mr-2" />
                  <span>Approved</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="status" className="w-4 h-4 mr-2" />
                  <span>Rejected</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-[1.5rem]">
          <div className="space-y-6">
            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Last Name
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.lastName}
                disabled={true}
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                First Name
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.firstName}
                disabled={true}
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Middle Name
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.middleName}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Town/City of Residence
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.cityOfResidence}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Country of Residence
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.countryOfResidence}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Local Govt. of Residence
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.localGovernmentAreaOfResidence}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Address of Residence
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.addressOfResidence}
                disabled
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Emergency Contact
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.emergencyContactName}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.emergencyContactNumber}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Employment Status
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.employmentStatus}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                How are you an Offa Indigene?
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.indigeneByWho}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Name of Adoptee
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.adoptedParentName}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Current E-mail Address
              </label>
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.email}
                disabled
              />
            </div>

            <div>
              <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
                Current phone number
              </label>
              <input
                type="tel"
                className="w-full p-3 rounded-lg bg-gray-100"
                defaultValue={user.phoneNumber}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </MaxContainer>
  ) : (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">No User Available</h1>
        <p className="text-gray-600">
          There is no user at the moment. Please check back later.
        </p>
      </div>
    </div>
  );
};

export default UserProfileForm;
