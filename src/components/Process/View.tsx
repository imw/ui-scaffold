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
import ProcessAside, { ProcessAsideFooterMbl } from './Aside'
import Header from './Header'
import logoBrand from '/assets/logo.svg'
import confirmImg from '/assets/spreadsheet-confirm-modal2.png'
import successImg from '/assets/success2.png'

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
        <Box
          mb={10}
          mt={6}
          px={{
            base: 2,
            sm: 4,
          }}
        >
          <Img src={logoBrand} maxW={{ base: '300px', md: '400px' }} />
        </Box>
        <Header />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          alignItems='start'
          gap={{ md: 10 }}
          px={{
            base: 2,
            sm: 4,
          }}
        >
          <Tabs
            order={{ base: 2, md: 1 }}
            variant='process'
            index={tabIndex}
            onChange={handleTabsChange}
            flexGrow={0}
            flexShrink={0}
            flexBasis={{ base: '100%', md: '60%', lg2: '70%', xl2: '75%' }}
            w='full'
          >
            <TabList>
              <Tab>{t('process.questions')}</Tab>
              {election?.status !== ElectionStatus.CANCELED && <Tab>{t('process.results')}</Tab>}
            </TabList>
            <TabPanels>
              <TabPanel>
                <ElectionQuestions
                  confirmContents={(questions, answers) => <ConfirmVoteModal questions={questions} answers={answers} />}
                />
              </TabPanel>
              <TabPanel mb={20}>
                <ElectionResults />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Flex
            flexGrow={1}
            flexDirection='column'
            alignItems={{ base: 'center', md: 'start' }}
            order={{ base: 1, md: 2 }}
            gap={2}
            mx={{ base: 'auto', md: 0 }}
            position={{ md: 'sticky' }}
            top={20}
            mt={10}
            minW={{ base: '370px', md: '0px' }}
            maxW={{ md: '265px', md2: '290px' }}
          >
            <ProcessAside setQuestionsTab={setQuestionsTab} />
          </Flex>
        </Flex>
      </Box>

      <Box
        position='sticky'
        bottom={0}
        left={0}
        bgColor='process.aside.aside_footer_mbl_border'
        pt={1}
        display={{ base: 'block', md: 'none' }}
      >
        <ProcessAsideFooterMbl setQuestionsTab={setQuestionsTab} />
      </Box>
      <Text
        display='inline-block'
        px={{ base: 10, xl: 32 }}
        mt={{ base: '50px', md: '100px' }}
        textAlign='center'
        fontSize='lg'
      >
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
          <Flex justifyContent='center' bgColor='#FFE554' maxH='150px'>
            <Img src={successImg} />
          </Flex>
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
        <Flex justifyContent='center' bgColor='#FFE554' maxH='150px'>
          <Img src={confirmImg} />
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
          borderRadius='lg2'
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
