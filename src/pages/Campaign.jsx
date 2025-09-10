import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
// import {
//   addEvent,
//   getAllCampaign,
//   getCampaginAnalytics,
//   sendMessage,
// } from "../api_utils/api_routes";
import { Toast } from "primereact/toast";
import CampaingDetailCard from "../components/ui/CampaingDetailCard";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";

const Campaign = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [data, setData] = useState({
    event: "Sample Event",
    whatsapp: {
      total: 120,
      replied: 45,
      confirmed: 30,
      RSVP: 10,
    },
    calls: {
      total: 80,
      replied: 40,
      confirmed: 25,
      RSVP: 8,
    },
  });
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [campLoading, setCampLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [event, setEvent] = useState({
    category: "",
    file: null,
    contacts: [{ code: "91", number: "" }],
  });
  const [campaign, setCampaign] = useState(null);
  const [selectCampaign, setSelectCampaign] = useState(null);

  const fetchAllCampaign = async () => {
    // setCampLoading(true);
    // try {
    //   const allCampaign = await getAllCampaign();
    //   setCampaign(allCampaign);
    // } catch (error) {
    //   toast.current.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail: "Error occured while listing all the campaign. Please Refresh",
    //     life: 3000,
    //   });
    // } finally {
    //   setCampLoading(false);
    // }
  };

  useEffect(() => {
    fetchAllCampaign();
  }, []);

  const fetchData = async () => {
    // setLoading(true);
    // try {
    //   const event_name = `${selectCampaign.event}`;
    //   const details = await getCampaginAnalytics(event_name);
    //   console.log("campaign analytics", details);
    //   if (details.error) {
    //     toast.current.show({
    //       severity: "error",
    //       summary: "Error",
    //       detail: details.error,
    //       life: 3000,
    //     });
    //   } else {
    //     setData(details);
    //   }
    // } catch (error) {
    //   toast.current.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail:
    //       "Error occured while fetching campaign analytics. Please Refresh",
    //     life: 3000,
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    if (selectCampaign) {
      fetchData();
    }
  }, [selectCampaign]);

  const removePhoneField = (index) => {
    const updated = event.contacts.filter((_, i) => i !== index);
    setEvent((prev) => ({ ...prev, contacts: updated }));
  };

  const addPhoneField = () => {
    setEvent((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { code: "91", number: "" }],
    }));
  };

  const handlePhoneChange = (index, field, value) => {
    const updated = [...event.contacts];
    updated[index][field] = value;
    setEvent((prev) => ({ ...prev, contacts: updated }));
  };

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvent((prev) => ({ ...prev, file }));
    }
    console.log(file.name);
  };

  const handleSendMessage = async () => {
    // if (!event.category) {
    //   toast.current.show({
    //     severity: "error",
    //     summary: "Missing Event",
    //     detail: "Please select an event.",
    //     life: 3000,
    //   });
    //   return;
    // }

    // if (!event.file && (!event.contacts || event.contacts.length === 0)) {
    //   toast.current.show({
    //     severity: "error",
    //     summary: "No Contacts",
    //     detail: "Please upload a file or enter at least one contact.",
    //     life: 3000,
    //   });
    //   return;
    // }

    // try {
    //   setSendLoading(true);

    //   const resp = await sendMessage({
    //     event: event.category.template_id,
    //     file: event.file,
    //     contacts: event.file ? null : event.contacts,
    //   });

    //   if (resp.status !== "success") {
    //     console.log(resp);
    //     throw new Error(resp.message || "Unknown error occurred");
    //   }

    //   toast.current.show({
    //     severity: "success",
    //     summary: "Success",
    //     detail: "Message sent successfully.",
    //     life: 3000,
    //   });

    //   setEvent({
    //     category: "",
    //     file: null,
    //     contacts: [{ code: "91", number: "" }],
    //   });

    //   setVisible(false);
    // } catch (error) {
    //   console.log(error);
    //   toast.current.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail: error.message || "Failed to send message.",
    //     life: 3000,
    //   });
    // } finally {
    //   setSendLoading(false);
    // }
  };

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="danger"
        onClick={() => setVisible(false)}
        disabled={sendLoading}
        className="p-button-text"
      />
      <Button
        label="Send"
        loading={sendLoading}
        icon="pi pi-send"
        severity="info"
        onClick={handleSendMessage}
        autoFocus
      />
    </div>
  );

  return (
    <div className="my-10">
      <Toast ref={toast} />
      <div className="w-full flex flex-row-reverse items-center justify-between">
        <Button
          label="Launch Campaign"
          icon="pi pi-send"
          severity="info"
          onClick={() => setVisible(true)}
        />

        <Dropdown
          value={selectCampaign}
          onChange={(e) => setSelectCampaign(e.target.value)}
          options={campaign}
          optionLabel="event"
          placeholder="Select an event"
          className="w-full md:w-[30%] md:w-14rem"
          loading={campLoading}
        />
      </div>

      {loading ? (
        <div className="my-5 h-full">
          <Skeleton height="300px" width="100%" borderRadius="10px" />
        </div>
      ) : data ? (
        <div>
          <div className="my-10 h-full p-5 bg-[#222222]">
            <div className="w-full text-3xl my-5">Launch Campaign</div>
            <div className="mt-10">Add Contacts</div>
            <div className="space-y-3 my-5">
              <div className="flex gap-5 w-full">
                <label className=" py-4 border rounded cursor-pointer hover:bg-gray-900/40 transition-all text-[#c4c4c4] inline-block w-[90%] text-center bg-[#1e1e1e]">
                  Upload Excel File
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleSelect}
                    className="hidden"
                  />
                </label>

                <a href="/idac_template_sample.xlsx" download>
                  <Button
                    label="Download Sample"
                    icon="pi pi-file-excel"
                    severity="info"
                    className="flex-1"
                    outlined
                    tooltip="Download sample excel file"
                  />
                </a>
              </div>

              {event.file && (
                <div className="w-full flex items-center justify-center">
                  <div className="text-sm">
                    Selected file:{" "}
                    <span className="font-medium">{event.file.name}</span>
                  </div>
                  <Button
                    icon="pi pi-times"
                    severity="danger"
                    text
                    rounded
                    onClick={() => setEvent({ ...event, file: "" })}
                    tooltip="Remove"
                  />
                </div>
              )}
            </div>

            <Divider />

            <div className="space-y-3 mt-5">
              <div>Or Enter manually</div>
              {event.contacts.map((field, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <InputText
                    placeholder="91"
                    value={field.code}
                    onChange={(e) =>
                      handlePhoneChange(index, "code", e.target.value)
                    }
                    className="w-[100px]"
                  />
                  <InputText
                    placeholder="Phone number"
                    value={field.number}
                    onChange={(e) =>
                      handlePhoneChange(index, "number", e.target.value)
                    }
                    className="w-full"
                  />
                  {event.contacts.length > 1 && (
                    <Button
                      icon="pi pi-times"
                      severity="danger"
                      text
                      rounded
                      onClick={() => removePhoneField(index)}
                      tooltip="Remove"
                    />
                  )}
                </div>
              ))}

              <Button
                label="Add More"
                icon="pi pi-plus"
                text
                className="text-blue-400"
                onClick={addPhoneField}
              />
            </div>
          </div>
          <Divider />
          <div className="my-10 h-full">
            <CampaingDetailCard
              title={data?.event ? `${data.event} Analytics` : ""}
              col1={"Total Messages Sent"}
              col2={"Total People Replied"}
              col3={"Total People Confirmed"}
              col4={"RSVP No."}
              col1Val={data.whatsapp.total || "N/A"}
              col2Val={data.whatsapp.replied || "N/A"}
              col3Val={data.whatsapp.confirmed || "N/A"}
              col4Val={data.whatsapp.RSVP || "N/A"}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-[200px] bg-[#1e1e1e] rounded-xl text-white/80 flex items-center justify-center">
          {selectCampaign
            ? "No details available"
            : "ⓘ Select an event to view its campaign details."}
        </div>
      )}

      <Dialog
        header="Create Campaign Message"
        visible={visible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
        position="center"
      >
        <div>
          <div className="space-y-3 my-3">
            <div>Type</div>
            <Dropdown
              value={event.category}
              onChange={(e) => setEvent({ ...event, category: e.target.value })}
              options={[
                { label: "Text", value: "text" },
                { label: "Button", value: "button" },
                { label: "List", value: "list" },
              ]}
              placeholder="Select type of message"
              className="w-full"
            />

            {/* TEXT MESSAGE */}
            {event.category === "text" && (
              <div className="mt-3">
                <label className="block mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-2 rounded bg-[#1e1e1e] text-white"
                  placeholder="Enter your message..."
                  value={event.text || ""}
                  onChange={(e) => setEvent({ ...event, text: e.target.value })}
                />
              </div>
            )}

            {/* BUTTON MESSAGE */}
            {event.category === "button" && (
              <div className="mt-3 space-y-4">
                <div>
                  <label className="block mb-2">Header</label>
                  <InputText
                    className="w-full"
                    placeholder="Enter header..."
                    value={event.header || ""}
                    onChange={(e) =>
                      setEvent({ ...event, header: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full p-2 rounded bg-[#1e1e1e] text-white"
                    placeholder="Enter your message..."
                    value={event.text || ""}
                    onChange={(e) =>
                      setEvent({ ...event, text: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2">Footer</label>
                  <InputText
                    className="w-full"
                    placeholder="Enter footer..."
                    value={event.footer || ""}
                    onChange={(e) =>
                      setEvent({ ...event, footer: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-between items-center mt-3">
                  <label className="block">Buttons</label>
                  <Button
                    label="Add Button"
                    icon="pi pi-plus"
                    text
                    onClick={() =>
                      setEvent((prev) => ({
                        ...prev,
                        buttons: [
                          ...(prev.buttons || []),
                          { text: "", id: "", type: "" },
                        ],
                      }))
                    }
                  />
                </div>

                {(event.buttons || []).map((btn, index) => (
                  <div
                    key={index}
                    className="flex w-full gap-5 items-center"
                  >
                    <InputText
                      placeholder="Button Text"
                      value={btn.text}
                      onChange={(e) => {
                        const updated = [...event.buttons];
                        updated[index].text = e.target.value;
                        setEvent({ ...event, buttons: updated });
                      }}
                      className="w-full"
                    />
                    <InputText
                      placeholder="Button ID"
                      value={btn.id}
                      onChange={(e) => {
                        const updated = [...event.buttons];
                        updated[index].id = e.target.value;
                        setEvent({ ...event, buttons: updated });
                      }}
                      className="w-full"
                    />
                    <Dropdown
                      value={btn.type}
                      onChange={(e) => {
                        const updated = [...event.buttons];
                        updated[index].type = e.target.value;
                        setEvent({ ...event, buttons: updated });
                      }}
                      options={[
                        { label: "Quick Reply", value: "quick_reply" },
                        { label: "URL", value: "url" },
                        { label: "Call", value: "call" },
                      ]}
                      placeholder="Select type"
                      className="w-full"
                    />
                    <Button
                      icon="pi pi-times"
                      severity="danger"
                      text
                      rounded
                      onClick={() => {
                        const updated = event.buttons.filter(
                          (_, i) => i !== index
                        );
                        setEvent({ ...event, buttons: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* LIST MESSAGE */}
            {event.category === "list" && (
              <div className="mt-3 space-y-4">
                <div>
                  <label className="block mb-2">Header</label>
                  <InputText
                    className="w-full"
                    placeholder="Enter header..."
                    value={event.header || ""}
                    onChange={(e) =>
                      setEvent({ ...event, header: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full p-2 rounded bg-[#1e1e1e] text-white"
                    placeholder="Enter your message..."
                    value={event.text || ""}
                    onChange={(e) =>
                      setEvent({ ...event, text: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2">Footer</label>
                  <InputText
                    className="w-full"
                    placeholder="Enter footer..."
                    value={event.footer || ""}
                    onChange={(e) =>
                      setEvent({ ...event, footer: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-between items-center mt-3">
                  <label className="block">List Options</label>
                  <Button
                    label="Add Option"
                    icon="pi pi-plus"
                    text
                    onClick={() =>
                      setEvent((prev) => ({
                        ...prev,
                        listOptions: [
                          ...(prev.listOptions || []),
                          { text: "", id: "" },
                        ],
                      }))
                    }
                  />
                </div>

                {(event.listOptions || []).map((opt, index) => (
                  <div
                    key={index}
                    className="flex w-full gap-5 items-center"
                  >
                    <InputText
                      placeholder="Option Text"
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...event.listOptions];
                        updated[index].text = e.target.value;
                        setEvent({ ...event, listOptions: updated });
                      }}
                      className="w-full"
                    />
                    <InputText
                      placeholder="Option ID"
                      value={opt.id}
                      onChange={(e) => {
                        const updated = [...event.listOptions];
                        updated[index].id = e.target.value;
                        setEvent({ ...event, listOptions: updated });
                      }}
                      className="w-full"
                    />
                    <Button
                    className="mx-5"
                      icon="pi pi-times"
                      severity="danger"
                      text
                      rounded
                      onClick={() => {
                        const updated = event.listOptions.filter(
                          (_, i) => i !== index
                        );
                        setEvent({ ...event, listOptions: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Campaign;
