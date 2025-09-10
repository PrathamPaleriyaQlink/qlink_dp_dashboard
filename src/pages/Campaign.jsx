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
import {
  listCampaigns,
  getCampaignStats,
  sendCampaignMessages,
} from "../api_utils/api_routes";

const Campaign = () => {
  const toast = useRef(null);
  const navigate = useNavigate();

  const [campaignOptions, setCampaignOptions] = useState([]);
  const [selectCampaign, setSelectCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const [event, setEvent] = useState({
    file: null,
    contacts: [],
  });

  // Fetch all campaigns for dropdown
  const fetchAllCampaign = async () => {
    setLoading(true);
    try {
      const campaigns = await listCampaigns();
      setCampaignOptions(campaigns);
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load campaigns",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats for selected campaign
  const fetchStats = async (campaignId) => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const statsData = await getCampaignStats(campaignId);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load stats",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCampaign();
  }, []);

  useEffect(() => {
    if (selectCampaign) {
      fetchStats(selectCampaign.id);
    }
  }, [selectCampaign]);

  // Phone fields handlers
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

  // Trigger campaign send
  const handleSendMessage = async () => {
    if (!selectCampaign) {
      toast.current.show({
        severity: "warn",
        summary: "Select Campaign",
        detail: "Please select a campaign first",
      });
      return;
    }

    if (!event.file && event.contacts.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "No Contacts",
        detail: "Please upload a file or enter at least one number",
      });
      return;
    }

    setSendLoading(true);
    try {
      const phone_numbers = event.contacts.map((c) => c.number);
      const phone_codes = event.contacts.map((c) => c.code);

      await sendCampaignMessages(selectCampaign.id, {
        file: event.file,
        phone_numbers,
        phone_codes,
      });

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Campaign messages sent successfully",
      });

      // Clear inputs
      setEvent({ file: null, contacts: [{ code: "91", number: "" }] });

      // Refresh stats
      fetchStats(selectCampaign.id);
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to send messages",
      });
    } finally {
      setSendLoading(false);
    }
  };

  useEffect(() => {
    if (!selectCampaign) return;

    fetchStats(selectCampaign.id);

    const interval = setInterval(() => {
      fetchStats(selectCampaign.id);
    }, 1 * 60 * 1000); 

    return () => clearInterval(interval); 
  }, [selectCampaign]);

  return (
    <div className="my-10">
      <Toast ref={toast} />
      <div className="w-full flex items-center justify-between mb-5">
        <Dropdown
          value={selectCampaign || null}
          onChange={(e) => setSelectCampaign(e.value)}
          options={campaignOptions}
          optionLabel="name"
          placeholder="Select a campaign"
          className="w-full md:w-1/3"
          loading={loading}
        />
      </div>

      <div className="my-10 h-full p-5 bg-[#222222]">
        <div className="text-3xl my-5">Launch Campaign</div>

        <div className="mt-5">Add Contacts</div>
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
            <div className="w-full flex items-center justify-center mt-2">
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

        <div className="space-y-3 my-5">
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
              {event.contacts.length > 0 && (
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

        <Button
          label="Send Campaign"
          icon="pi pi-send"
          loading={sendLoading}
          className="mt-5"
          onClick={handleSendMessage}
        />
      </div>

      <Divider />

      {loading ? (
        <Skeleton height="300px" width="100%" borderRadius="10px" />
      ) : stats ? (
        <CampaingDetailCard
          title={selectCampaign?.name ? `${selectCampaign.name} Analytics` : ""}
          col1={"Total Messages Sent"}
          col2={"Total Seen"}
          col3={"Total Delivered"}
          col1Val={stats.total || "N/A"}
          col2Val={stats.total_seen || "N/A"}
          col3Val={stats.total_delivered || "N/A"}
        />
      ) : (
        <div className="w-full h-[200px] bg-[#1e1e1e] rounded-xl text-white/80 flex items-center justify-center">
          {selectCampaign
            ? "No stats available"
            : "ⓘ Select a campaign to view stats."}
        </div>
      )}
    </div>
  );
};

export default Campaign;
