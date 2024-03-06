"use client";
import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { proxyAccApi } from "@/app/api-client/proxy-acc-api";
import { IProxyData, IUpdateProxyAccount } from "@/app/common";

interface IUpdateProxyModalProps {
  isOpen: boolean;
  onClose: () => void;
  proxy: IProxyData;
}

const UpdateProxyModal: React.FC<IUpdateProxyModalProps> = ({
  isOpen,
  onClose,
  proxy,
}) => {
  const [loading, setLoading] = useState(false);
  const [whitelistedIp, setWhitelistedIp] = useState(
    proxy.whitelisted_ips ?? ""
  );
  const [ipRotationPeriod, setIpRotationPeriod] = useState(
    proxy.ip_rotation_period.toString()
  );
  const [prioritizedIp, setPrioritizedIp] = useState(
    proxy.prioritized_ip ?? ""
  );
  const [prioritizedIpLevel, setPrioritizedIpLevel] = useState(
    proxy.prioritized_ip_level ?? "Default"
  );
  const [countryGeoNameId, setCountryGeoNameId] = useState(
    proxy.country_geoname_id.toString()
  );
  const [cityGeoNameId, setCityGeoNameId] = useState(
    proxy.city_geoname_id ?? ""
  );
  const [ratePerKb, setRatePerKb] = useState(proxy.rate_per_kb.toString());
  const [ratePerSecond, setRatePerSecond] = useState(
    proxy.rate_per_second.toString()
  );

  const { onCopy, hasCopied } = useClipboard(proxy.username);
  const handleCopyAccountId = () => {
    onCopy();
  };

  async function handleUpdate(proxyAccountId: string) {
    try {
      const payload: IUpdateProxyAccount = {
        proxy_acc_id: proxyAccountId,
        ip_rotation_period: +ipRotationPeriod,
        whitelisted_ip: whitelistedIp === "" ? null : whitelistedIp,
        country_geoname_id: +countryGeoNameId,
        city_geoname_id: cityGeoNameId === "" ? null : +cityGeoNameId,
        rate_per_second: +ratePerSecond,
        rate_per_kb: +ratePerKb,
        prioritized_ip: prioritizedIp,
        prioritized_ip_level:
          prioritizedIpLevel === "Default" ? null : prioritizedIpLevel,
      };
      const response = await proxyAccApi.updateProxyAccount(payload);
    } catch (error) {
      console.error("Failed to update proxy account, error", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update proxy account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Proxy Account ID</FormLabel>
            <HStack alignItems={"baseline"} justifyContent={"space-between"}>
              <Input
                placeholder={proxy.username}
                _placeholder={{ opacity: 1.5, color: "white" }}
                disabled
              />
              <Tooltip label={hasCopied ? "Copied" : "Copy Account ID"}>
                <IconButton
                  colorScheme="blue"
                  aria-label="Copy Account ID"
                  icon={<CopyIcon />}
                  onClick={handleCopyAccountId}
                />
              </Tooltip>
            </HStack>
          </FormControl>

          <HStack mt={4}>
            <FormControl>
              <FormLabel>Whitelisted IP</FormLabel>
              <Input
                value={whitelistedIp}
                onChange={(e) => setWhitelistedIp(e.target.value)}
                placeholder={proxy?.whitelisted_ips}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>IP Rotation Period (second)</FormLabel>
              <Input
                type={"number"}
                value={ipRotationPeriod}
                onChange={(e) => setIpRotationPeriod(e.target.value)}
                placeholder={proxy.ip_rotation_period.toString()}
              />
              {/* {!isRotationPeriodEmpty ? <></> : <></>} */}
            </FormControl>
          </HStack>

          <HStack direction="row" mt={4}>
            <FormControl>
              <FormLabel>Prioritized IP</FormLabel>
              <Input
                value={prioritizedIp}
                onChange={(e) => setPrioritizedIp(e.target.value)}
                placeholder={proxy?.prioritized_ip}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Level</FormLabel>
              <Select
                value={prioritizedIpLevel}
                onChange={(e) => setPrioritizedIpLevel(e.target.value)}
              >
                <option value="Default">Default</option>
                <option value="Normal">Normal</option>
                <option value="Strict">Strict</option>
              </Select>
            </FormControl>
          </HStack>

          <HStack direction="row" mt={3}>
            <FormControl isRequired>
              <FormLabel>Country Geo name ID</FormLabel>
              <Input
                value={countryGeoNameId}
                onChange={(e) => setCountryGeoNameId(e.target.value)}
                type={"number"}
                placeholder={proxy.country_geoname_id.toString()}
              />
            </FormControl>
            <FormControl>
              <FormLabel>City Geo name ID</FormLabel>
              <Input
                value={cityGeoNameId}
                onChange={(e) => setCityGeoNameId(e.target.value)}
                type={"number"}
                placeholder={proxy.city_geoname_id?.toString()}
              />
            </FormControl>
          </HStack>

          <HStack direction="row" mt={3}>
            <FormControl isRequired>
              <FormLabel>Rate (U2U/GB)</FormLabel>
              <Input
                value={ratePerKb}
                onChange={(e) => setRatePerKb(e.target.value)}
                type={"number"}
                placeholder={proxy.rate_per_kb.toString()}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Rate Per Second</FormLabel>
              <Input
                value={ratePerSecond}
                onChange={(e) => setRatePerSecond(e.target.value)}
                type={"number"}
                placeholder={proxy.rate_per_second.toString()}
              />
            </FormControl>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => handleUpdate(proxy.username)}
            isLoading={loading}
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateProxyModal;
