"use client";

import { proxyAccApi } from "@/app/api-client/proxy-acc-api";
import { ICreateProxyAccount } from "@/app/common";
import {
  Button,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface ICreateProxyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProxyModal: React.FC<ICreateProxyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [whitelistedIp, setWhitelistedIp] = useState("");
  const [countryGeoNameId, setCountryGeoNameId] = useState("");
  const [cityGeoNameId, setCityGeoNameId] = useState("");
  const [ratePerKb, setRatePerKb] = useState("");
  const [ratePerSecond, setRatePerSecond] = useState("");
  const [prioritizedIp, setPrioritizedIp] = useState("");
  const [prioritizedIpLevel, setPrioritizedIpLevel] = useState("");

  async function handleCreate() {
    try {
      const payload: ICreateProxyAccount = {
        whitelisted_ip: whitelistedIp,
        country_geoname_id: +countryGeoNameId,
        city_geoname_id: cityGeoNameId ? +cityGeoNameId : null,
        rate_per_second: +ratePerSecond,
        rate_per_kb: +ratePerKb,
        prioritized_ip: prioritizedIp ? prioritizedIp : null,
        prioritized_ip_level:
          prioritizedIpLevel !== "" ? prioritizedIpLevel : null,
      };
      // console.log("payload: ", payload);
      const response = await proxyAccApi.createProxyAccount(payload);
      // console.log(response.data);
    } catch (error) {
      console.error("Failed to create new proxy account, error", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new proxy account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired>
            <FormLabel>Whitelist IP</FormLabel>
            <Input
              placeholder="192.158.1.38"
              value={whitelistedIp}
              onChange={(e) => setWhitelistedIp(e.target.value)}
            />
          </FormControl>

          <HStack direction="row" mt={4}>
            <FormControl isRequired>
              <FormLabel>Country GeoName ID</FormLabel>
              <Input
                type="number"
                placeholder="Vietnam: 1562822"
                value={countryGeoNameId}
                defaultValue={"1562822"}
                onChange={(e) => setCountryGeoNameId(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>City GeoName ID</FormLabel>
              <Input
                type="number"
                placeholder="HCMC: 1566083"
                value={cityGeoNameId}
                onChange={(e) => setCityGeoNameId(e.target.value)}
              />
            </FormControl>
          </HStack>

          <HStack direction="row" mt={4}>
            <FormControl isRequired>
              <FormLabel>Rate (U2U/GB)</FormLabel>
              <Input
                placeholder="1000"
                value={ratePerKb}
                onChange={(e) => setRatePerKb(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Rate Per Second</FormLabel>
              <Input
                placeholder="1000"
                value={ratePerSecond}
                onChange={(e) => setRatePerSecond(e.target.value)}
              />
            </FormControl>
          </HStack>
          <HStack direction="row" mt={4}>
            <FormControl mt={3}>
              <FormLabel>Prioritized IP</FormLabel>
              <Input
                placeholder="Prioritized IP"
                value={prioritizedIp}
                onChange={(e) => setPrioritizedIp(e.target.value)}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Prioritized IP Level</FormLabel>
              <Select onChange={(e) => setPrioritizedIpLevel(e.target.value)}>
                <option value={prioritizedIpLevel}>Default</option>
                <option value="Normal">Normal</option>
                <option value="Strict">Strict</option>
              </Select>
            </FormControl>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleCreate}
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

export default CreateProxyModal;
