import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import CampaingDetailCard from "../components/ui/CampaingDetailCard";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { createOrUpdateCampaign } from "../api_utils/api_routes";

const Campaign = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [data, setData] = useState({
    event: "Sample Event",
    whatsapp: { total: 120, replied: 45, confirmed: 30, RSVP: 10 },
    calls: { total: 80, replied: 40, confirmed: 25, RSVP: 8 },
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

  const [campaign, setCampaign] = useState({
    name: "",
    category: null,
    text: "",
    header: "",
    footer: "",
    buttons: [],
    listOptions: [],
  });

  const [selectCampaign, setSelectCampaign] = useState(null);

  // Dummy campaigns for dropdown
  const campaignOptions = [
    { event: "Event A", id: 1 },
    { event: "Event B", id: 2 },
  ];

  const fetchAllCampaign = async () => {
    // fetch campaigns here
  };

  useEffect(() => {
    fetchAllCampaign();
  }, []);

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
    if (file) setEvent((prev) => ({ ...prev, file }));
  };

  const handleSendMessage = async () => {
    // Send message logic here
  };

  const handleAddCampaign = async () => {
    if (!campaign.name || !campaign.category) {
      toast.current.show({
        severity: "warn",
        summary: "Missing Fields",
        detail: "Please enter campaign name and select type",
      });
      return;
    }

    setSendLoading(true);

    try {
      // Prepare payload without contacts or file
      const payload = {
        name: campaign.name,
        category: campaign.category,
        text: campaign.text,
        header: campaign.header,
        footer: campaign.footer,
        buttons: campaign.buttons,
        listOptions: campaign.listOptions,
      };

      const response = await fetch("/api/campaign/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to add campaign");

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Campaign added successfully",
      });

      // Reset campaign form
      setCampaign({
        name: "",
        category: null,
        text: "",
        header: "",
        footer: "",
        buttons: [],
        listOptions: [],
      });

      setVisible(false);

      // Refresh campaigns list if needed
      fetchAllCampaign();
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Something went wrong",
      });
    } finally {
      setSendLoading(false);
    }
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
        onClick={handleAddCampaign}
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
          value={selectCampaign || null}
          onChange={(e) => setSelectCampaign(e.value)}
          options={campaignOptions}
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
                    onClick={() => setEvent({ ...event, file: null })}
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
        onHide={() => setVisible(false)}
        footer={footerContent}
        position="center"
      >
        <div className="space-y-3 my-3">
          {/* Campaign Name */}
          <div className="mt-3">
            <label className="block mb-2">Campaign Name</label>
            <InputText
              className="w-full"
              placeholder="Enter campaign name..."
              value={campaign.name || ""}
              onChange={(e) =>
                setCampaign({ ...campaign, name: e.target.value })
              }
            />
          </div>

          {/* Type Dropdown */}
          <div>Type</div>
          <Dropdown
            value={campaign.category || null}
            onChange={(e) => setCampaign({ ...campaign, category: e.value })}
            options={[
              { label: "Text", value: "text" },
              { label: "Button", value: "button" },
              { label: "List", value: "list" },
            ]}
            placeholder="Select type of message"
            className="w-full"
          />

          {/* TEXT MESSAGE */}
          {campaign.category === "text" && (
            <div className="mt-3">
              <label className="block mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full p-2 rounded bg-[#1e1e1e] text-white"
                placeholder="Enter your message..."
                value={campaign.text || ""}
                onChange={(e) =>
                  setCampaign({ ...campaign, text: e.target.value })
                }
              />
            </div>
          )}

          {/* BUTTON MESSAGE */}
          {campaign.category === "button" && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="block mb-2">Header</label>
                <InputText
                  className="w-full"
                  placeholder="Enter header..."
                  value={campaign.header || ""}
                  onChange={(e) =>
                    setCampaign({ ...campaign, header: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-2 rounded bg-[#1e1e1e] text-white"
                  placeholder="Enter your message..."
                  value={campaign.text || ""}
                  onChange={(e) =>
                    setCampaign({ ...campaign, text: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-2">Footer</label>
                <InputText
                  className="w-full"
                  placeholder="Enter footer..."
                  value={campaign.footer || ""}
                  onChange={(e) =>
                    setCampaign({ ...campaign, footer: e.target.value })
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
                    setCampaign((prev) => ({
                      ...prev,
                      buttons: [
                        ...(prev.buttons || []),
                        { text: "", id: "", type: null },
                      ],
                    }))
                  }
                />
              </div>

              {(campaign.buttons || []).map((btn, index) => (
                <div key={index} className="flex w-full gap-5 items-center">
                  <InputText
                    placeholder="Button Text"
                    value={btn.text || ""}
                    onChange={(e) => {
                      const updated = [...campaign.buttons];
                      updated[index].text = e.target.value;
                      setCampaign({ ...campaign, buttons: updated });
                    }}
                    className="w-full"
                  />
                  <InputText
                    placeholder="Button ID"
                    value={btn.id || ""}
                    onChange={(e) => {
                      const updated = [...campaign.buttons];
                      updated[index].id = e.target.value;
                      setCampaign({ ...campaign, buttons: updated });
                    }}
                    className="w-full"
                  />
                  <Dropdown
                    value={btn.type || null}
                    onChange={(e) => {
                      const updated = [...campaign.buttons];
                      updated[index].type = e.value;
                      setCampaign({ ...campaign, buttons: updated });
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
                      const updated = campaign.buttons.filter(
                        (_, i) => i !== index
                      );
                      setCampaign({ ...campaign, buttons: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* LIST MESSAGE */}
          {campaign.category === "list" && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="block mb-2">Header</label>
                <InputText
                  className="w-full"
                  placeholder="Enter header..."
                  value={campaign.header || ""}
                  onChange={(e) =>
                    setCampaign({ ...campaign, header: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-2 rounded bg-[#1e1e1e] text-white"
                  placeholder="Enter your message..."
                  value={campaign.text || ""}
                  onChange={(e) =>
                    setCampaign({ ...campaign, text: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-2">Footer</label>
                <InputText
                  className="w-full"
                  placeholder="Enter footer..."
                  value={campaign.footer || ""}
                  onChange={(e) =>
                    setCampaign({ ...campaign, footer: e.target.value })
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
                    setCampaign((prev) => ({
                      ...prev,
                      listOptions: [
                        ...(prev.listOptions || []),
                        { text: "", id: "" },
                      ],
                    }))
                  }
                />
              </div>

              {(campaign.listOptions || []).map((opt, index) => (
                <div key={index} className="flex w-full gap-5 items-center">
                  <InputText
                    placeholder="Option Text"
                    value={opt.text || ""}
                    onChange={(e) => {
                      const updated = [...campaign.listOptions];
                      updated[index].text = e.target.value;
                      setCampaign({ ...campaign, listOptions: updated });
                    }}
                    className="w-full"
                  />
                  <InputText
                    placeholder="Option ID"
                    value={opt.id || ""}
                    onChange={(e) => {
                      const updated = [...campaign.listOptions];
                      updated[index].id = e.target.value;
                      setCampaign({ ...campaign, listOptions: updated });
                    }}
                    className="w-full"
                  />
                  <Button
                    icon="pi pi-times"
                    severity="danger"
                    text
                    rounded
                    onClick={() => {
                      const updated = campaign.listOptions.filter(
                        (_, i) => i !== index
                      );
                      setCampaign({ ...campaign, listOptions: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default Campaign;
