import {
	Body,
	Container,
	Column,
	Head,
	Hr,
	Html,
	Preview,
	Row,
	Section,
	Text,
	Tailwind, Link,
} from "@react-email/components";
import * as React from "react";

interface EventProps {
	title?: string;
	displayName?: string;
	remoteIP?: string;
	detailsKey?: string;
	detailsValue?: string;
	detailsPrefix?: string;
	detailsSuffix?: string;
}

export const Event = ({
						  title,
						  displayName,
						  remoteIP,
						  detailsKey,
						  detailsValue,
						  detailsPrefix,
						  detailsSuffix,
					  }: EventProps) => {
	return (
		<Html lang="en" dir="ltr">
			<Head />
			<Preview>An important event has occurred with your account</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto font-sans px-2">
					<Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
						{title ? <Text className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">{title}</Text> : null}
						<Text className="text-black text-[14px] leading-[24px]">
							Hi {displayName},
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							This notification has been sent to you in order to notify you that a new <strong><i>{title}</i></strong>
						</Text>
						<Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
						<Text>Event Details:</Text>
						{detailsPrefix}
						<Section className="text-center">
							<Row>
								<Column>
									<Text><strong>{detailsKey}</strong></Text>
								</Column>
								<Column>{detailsValue}</Column>
							</Row>
						</Section>
						{detailsSuffix}
						<Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
						<Text className="text-[#666666] text-[12px] leading-[24px] text-center">
							This notification was intended for <span className="text-black">{displayName}</span>. This
							event notification was generated due to an action from <span className="text-black">{remoteIP}</span>.
							If you do not believe that your actions could have triggered this event or if you are
							concerned about your account's safety, please change your password and reach out to an
							administrator.
						</Text>
					</Container>
					<Text className="text-[#666666] text-[10px] leading-[24px] text-center text-muted">
						Powered by <Link href="https://www.authelia.com" target="_blank" className="text-[#666666]">Authelia</Link>
					</Text>
				</Body>
			</Tailwind>
		</Html>
	);
};

Event.PreviewProps = {
	displayName: "John Doe",
	detailsKey: "Example Detail",
	detailsValue: "Example Value",
	title: "Second Factor Method Added",
	remoteIP: "127.0.0.1",
} as EventProps;

export default Event;
