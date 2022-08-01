/* This example requires Tailwind CSS v2.0+ */
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/solid";

const mailingLists = [{ id: 1, title: "Midtrans" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PaymentGateway() {
  const [selectedMailingLists, setSelectedMailingLists] = useState(
    mailingLists[0]
  );

  return (
    <RadioGroup value={selectedMailingLists} onChange={setSelectedMailingLists}>
      <RadioGroup.Label className="text-base font-medium text-gray-900">
        Choose a Payment Gateway
      </RadioGroup.Label>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {mailingLists.map((mailingList) => (
          <RadioGroup.Option
            key={mailingList.id}
            value={mailingList}
            className={({ checked, active }) =>
              classNames(
                checked ? "border-transparent" : "border-gray-300",
                active ? "ring-2 ring-indigo-500" : "",
                "relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none"
              )
            }
          >
            {({ checked, active }) => (
              <>
                <div className="flex-1 flex">
                  <div className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block text-sm font-medium text-gray-900"
                      defaultChecked={mailingLists.length === 1 ? true : false}
                    >
                      {mailingList.title}
                    </RadioGroup.Label>
                  </div>
                </div>
                <CheckCircleIcon
                  className={classNames(
                    !checked ? "invisible" : "",
                    "h-5 w-5 text-indigo-600"
                  )}
                  aria-hidden="true"
                />
                <div
                  className={classNames(
                    active ? "border" : "border-2",
                    checked ? "border-indigo-500" : "border-transparent",
                    "absolute -inset-px rounded-lg pointer-events-none"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
