import {
  Box,
  Button,
  Flex,
  Img,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { ElectionQuestions, ElectionResults, environment } from '@vocdoni/chakra-components'
import { useClient, useElection } from '@vocdoni/react-providers'
import { ElectionStatus, IQuestion } from '@vocdoni/sdk'
import { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import ProcessAside from './Aside'
import Header from './Header'
import logoBrand1 from '/assets/erc-logo.png'
import logoBrand2 from '/assets/logo.svg'
import successImg from '/assets/success.png'

export const ProcessView = () => {
  const { t } = useTranslation()
  const { election } = useElection()

  const [tabIndex, setTabIndex] = useState(0)

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const setQuestionsTab = () => setTabIndex(0)

  useEffect(() => {
    if (election?.status === ElectionStatus.RESULTS) setTabIndex(1)
  }, [election])

  return (
    <>
      <Box>
        <Flex justifyContent='center' mb={10}>
          <Img src={logoBrand2} maxW='500px' />
        </Flex>
        <Header />
        <Flex direction={{ base: 'column', xl: 'row' }} gap={{ xl: 10 }} alignItems='start'>
          <Box flexGrow={0} flexShrink={0} flexBasis={{ base: '100%', xl: '75%' }} w='full'>
            <Tabs variant='process' index={tabIndex} onChange={handleTabsChange}>
              <TabList>
                <Tab>{t('process.questions')}</Tab>
                {election?.status !== ElectionStatus.CANCELED && <Tab>{t('process.results')}</Tab>}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ElectionQuestions
                    confirmContents={(questions, answers) => (
                      <ConfirmVoteModal questions={questions} answers={answers} />
                    )}
                  />
                </TabPanel>
                <TabPanel mb={20}>
                  <ElectionResults />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          <Flex
            w='full'
            justifyContent='center'
            position={{ xl: 'sticky' }}
            top={{ xl: 20 }}
            mt={{ xl: 10 }}
            mx={{ base: 'auto', xl: 0 }}
          >
            <ProcessAside setQuestionsTab={setQuestionsTab} />
          </Flex>
        </Flex>
      </Box>
      <Text display='inline-block' px={{ base: 10, xl: 32 }} mt='70px' fontSize='lg'>
        <Trans
          i18nKey='process.erc_footer'
          components={{
            strong: <Text as='span' fontWeight='bold' />,
            customLink: <Link variant='primary' href='https://vocdoni.io/' target='_blank' ml={1} />,
          }}
        />
      </Text>
      <SuccessVoteModal />
    </>
  )
}

const SuccessVoteModal = () => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { votesLeft, election, voted } = useElection()
  const { env } = useClient()

  const [vLeft, setVLeft] = useState<number>(0)

  useEffect(() => {
    if (!vLeft && votesLeft >= 0) {
      setVLeft(votesLeft)
    }

    if (vLeft && votesLeft < vLeft) {
      setVLeft(votesLeft)
      onOpen()
    }
  }, [votesLeft, vLeft])

  if (!election || !voted) return null

  const verify = environment.verifyVote(env, voted)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>{t('process.success_modal.title')}</Text>
          <Box bgImage={successImg} minH='300px' />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Trans
            i18nKey='process.success_modal.text'
            components={{
              verify: <Link variant='primary' href={verify} target='_blank' />,
              p: <Text mb={2} />,
            }}
          />
        </ModalBody>

        <ModalFooter mt={4}>
          <Button variant='rounded' colorScheme='primary' px={16} onClick={onClose}>
            {t('process.success_modal.btn')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const ConfirmVoteModal = ({ questions, answers }: { questions: IQuestion[]; answers: FieldValues }) => {
  const { t } = useTranslation()

  return (
    <>
      <ModalHeader>
        <Flex justifyContent='center' bgColor='#FFE94F' maxH='150px'>
          <Img src={logoBrand1} />
        </Flex>
      </ModalHeader>
      <ModalBody display='flex' flexDirection='column' gap={5} p={0} mb={2}>
        <Text textAlign='center' color='modal_description'>
          {t('process.spreadsheet.confirm.description')}
        </Text>
        <Flex
          flexDirection='column'
          maxH='200px'
          overflowY='scroll'
          boxShadow='rgba(128, 128, 128, 0.42) 1px 1px 1px 1px'
          px={2}
          borderRadius='lg'
        >
          {questions.map((q, i) => (
            <Box>
              <Box py={2}>
                <Text display='flex' flexDirection='column' gap={1} mb={1}>
                  <Trans
                    i18nKey='process.spreadsheet.confirm.question'
                    components={{
                      span: <Text as='span' fontWeight='bold' whiteSpace='nowrap' />,
                    }}
                    values={{
                      answer: q.title.default,
                      number: i + 1,
                    }}
                  />
                </Text>
                <Text display='flex' flexDirection='column' gap={1}>
                  <Trans
                    i18nKey='process.spreadsheet.confirm.option'
                    components={{
                      span: <Text as='span' fontWeight='bold' whiteSpace='nowrap' />,
                    }}
                    values={{
                      answer: q.choices[Number(answers[i])].title.default,
                      number: i + 1,
                    }}
                  />
                </Text>
              </Box>
              {i + 1 !== questions.length && <Box h='1px' bgColor='lightgray' />}
            </Box>
          ))}
        </Flex>
      </ModalBody>
    </>
  )
}
