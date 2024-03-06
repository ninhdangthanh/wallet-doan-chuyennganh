"use client";
import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Button,
  IconButton,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import styles from "../../styles/signin.module.scss";
import { EditIcon } from "@chakra-ui/icons";
import Head from "next/head";
import { useEffect, useState } from "react";
import { proxyAccApi } from "../api-client/proxy-acc-api";
import React from "react";
import { formatAccountId } from "../utils/format-address";
import CreateProxyModal from "../components/create-modal";
import UpdateProxyModal from "../components/update-modal";
import { IProxyData } from "../common";

export default function Dashboard() {
  const [proxyData, setProxyData] = useState<IProxyData[]>([]);
  const [proxyDetail, setProxyDetail] = useState<IProxyData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await proxyAccApi.getProxyAccounts();
        setProxyData(response.data);
      } catch (error) {
        console.error("Error fetching proxy data:", error);
      }
    };

    fetchData();
  }, []);

  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onClose: onUpdateModalClose,
  } = useDisclosure();

  const onDetail = (proxy: IProxyData) => {
    onUpdateModalOpen();
    setProxyDetail(proxy);
  };

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <Heading mb={4}>Dashboard Page</Heading>

      <main className={styles.pageContainer}>
        <div className={styles.buttonContainer}>
          <Button marginBlockEnd={"2rem"} onClick={onCreateModalOpen}>
            Create Proxy Account
          </Button>
          <CreateProxyModal
            isOpen={isCreateModalOpen}
            onClose={onCreateModalClose}
          />
        </div>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th textAlign={"center"}>Proxy Account ID</Th>
                <Th>IP Rotation Period</Th>
                <Th>Whitelisted IP</Th>
                <Th>Prioritized IP</Th>
                <Th>Prioritized IP Level</Th>
                <Th>Country Geo ID</Th>
                <Th>City Geo ID</Th>
                <Th>Rate(U2U/GB)</Th>
                <Th>Rate per Second</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {proxyData.map((proxy, index) => (
                <Tr key={index}>
                  <Td textAlign={"center"}>
                    {formatAccountId(proxy.username, 6)}
                  </Td>
                  <Td textAlign={"center"}>{proxy.ip_rotation_period}</Td>
                  <Td textAlign={"center"}>{proxy.whitelisted_ips}</Td>
                  <Td textAlign={"center"}>{proxy.prioritized_ip}</Td>
                  <Td textAlign={"center"}>{proxy.prioritized_ip_level}</Td>
                  <Td textAlign={"center"}>{proxy.country_geoname_id}</Td>
                  <Td textAlign={"center"}>{proxy.city_geoname_id}</Td>
                  <Td textAlign={"center"}>{proxy.rate_per_kb}</Td>
                  <Td textAlign={"center"}>{proxy.rate_per_second}</Td>
                  <Td>
                    <IconButton
                      aria-label="Edit Account"
                      icon={<EditIcon />}
                      onClick={() => onDetail(proxy)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {proxyDetail ? (
          <UpdateProxyModal
            isOpen={isUpdateModalOpen}
            onClose={onUpdateModalClose}
            proxy={proxyDetail}
          />
        ) : null}
      </main>
    </>
  );
}
