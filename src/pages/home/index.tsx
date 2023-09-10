import { Avatar, Button, ButtonGroup, Card, CardBody, CardHeader, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import RootLayout from "~/app/layout";

export default function Home() {
    return (
        <RootLayout>
            <Flex w="100vw" h="100%" align="center" justify="center">
                <Head>
                    <title>Hello World!</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    <Flex w="100%" h="100vh" align="center">
                        <ProfileCard />
                    </Flex>
                </main>
            </Flex>
        </RootLayout>
    );
}

function ProfileCard() {
    return (
        <Card
            w="auto"
            display="flex"
            direction="column"
            align="center"
            justify="center"
            padding="2">
            <ProfileHeader />
            <ProfileBody />
        </Card>
    );
}

function ProfileHeader() {
    return (
        <CardHeader
            display="flex"
            flexDirection="column"
            gap="2"
            alignItems="center">
            <Avatar
                height="80px"
                width="80px"
                src="https://i.pravatar.cc/300"
            />
            <Heading size="md">John Doe</Heading>
            <Text>Senior UX/UI Designer</Text>
        </CardHeader>
    );
}

function ProfileBody() {
    return (
        <CardBody display="flex" flexDirection="column" gap="2">
            <ProfileStats />
            <ProfileButtons />
        </CardBody>
    );
}

function ProfileStats() {
    const stats = {
        posts: 100,
        followers: 1782,
        following: 404,
    };
    return (
        <HStack w="100%" justify="space-evenly">
            {Object.entries(stats).map(([title, value]) => (
                <Flex
                    fontSize="xs"
                    key={title}
                    justify="center"
                    align="center"
                    direction="column">
                    <Text casing="capitalize" fontWeight="bold">
                        {title}
                    </Text>
                    <Text>{value}</Text>
                </Flex>
            ))}
        </HStack>
    );
}

function ProfileButtons() {
    return (
        <ButtonGroup colorScheme="blue">
            <Button>Follow</Button>
            <Button variant="outline">Message</Button>
        </ButtonGroup>
    );
}