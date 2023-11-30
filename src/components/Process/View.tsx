import {
  Box,
  Button,
  Flex,
  Icon,
  Link,
  ListItem,
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
  UnorderedList,
  useDisclosure,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { ElectionQuestions, ElectionResults, environment, useConfirm } from '@vocdoni/chakra-components'
import { useClient, useElection } from '@vocdoni/react-providers'
import { ElectionStatus, IQuestion } from '@vocdoni/sdk'
import { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { FaFacebook, FaReddit, FaTelegram, FaTwitter } from 'react-icons/fa'
import ProcessAside, { ProcessAsideFooterMbl } from './Aside'
import Header from './Header'
import confirmImg from '/assets/onvote-modal-confirm-spreadsheet.jpg'
import successImg from '/assets/onvote-modal-success-vote.jpg'

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
    <Box
      maxW='1920px'
      mx='auto'
      px={{
        base: '20px',
        md: '40px',
      }}
    >
      <Box mb={44} px={0}>
        <Header />
        <Flex
          direction={{ base: 'column', lg2: 'row' }}
          alignItems='start'
          gap={{ lg2: 10 }}
          px={{
            base: 2,
            sm: 4,
          }}
        >
          <Tabs
            order={{ base: 2, lg2: 1 }}
            variant='process'
            index={tabIndex}
            onChange={handleTabsChange}
            flexGrow={0}
            flexShrink={0}
            flexBasis={{ base: '100%', md: '60%', lg: '65%', lg2: '70%', xl2: '75%' }}
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
            alignItems={{ base: 'center', lg2: 'start' }}
            order={{ base: 1, lg2: 2 }}
            gap={2}
            mx={{ base: 'auto', lg2: 0 }}
            position={{ lg2: 'sticky' }}
            top={20}
            mt={10}
            maxW={{ md: '265px', lg2: '290px' }}
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
        display={{ base: 'block', lg2: 'none' }}
      >
        <ProcessAsideFooterMbl setQuestionsTab={setQuestionsTab} />
      </Box>

      <SuccessVoteModal />
    </Box>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [votesLeft, vLeft])

  if (!election || !voted) return null

  const verify = environment.verifyVote(env, voted)
  const url = encodeURIComponent(document.location.href)
  const caption = t('process.share_caption', { title: election?.title.default })
  const linked = encodeURIComponent(`${caption} — ${document.location.href}`)

  const twitter = `https://twitter.com/intent/tweet?text=${linked}`
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${url}`
  const telegram = `https://t.me/share/url?url=${url}&text=${caption}`
  const reddit = `https://reddit.com/submit?url=${url}&title=${caption}`

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>{t('process.success_modal.title')}</Text>
          <Box bgImage={successImg} />
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
          <UnorderedList listStyleType='none' display='flex' justifyContent='center' gap={6} mt={6} mb={2} ml={0}>
            <ListItem>
              <Link
                href={twitter}
                target='_blank'
                title={t('process.share_title', { network: 'twitter' })}
                rel='noopener noreferrer'
                variant='button-ghost'
              >
                <Icon as={FaTwitter} w={6} h={6} cursor='pointer' />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href={facebook}
                target='_blank'
                title={t('process.share_title', { network: 'facebook' })}
                rel='noopener noreferrer'
                variant='button-ghost'
              >
                <Icon as={FaFacebook} w={6} h={6} cursor='pointer' />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href={telegram}
                target='_blank'
                title={t('process.share_title', { network: 'telegram' })}
                rel='noopener noreferrer'
                variant='button-ghost'
              >
                <Icon as={FaTelegram} w={6} h={6} cursor='pointer' />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href={reddit}
                target='_blank'
                title={t('process.share_title', { network: 'reddit' })}
                rel='noopener noreferrer'
                variant='button-ghost'
              >
                <Icon as={FaReddit} w={6} h={6} cursor='pointer' />
              </Link>
            </ListItem>
          </UnorderedList>
        </ModalBody>

        <ModalFooter mt={4}>
          <Button onClick={onClose} variant='primary'>
            {t('process.success_modal.btn')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const ConfirmVoteModal = ({ questions, answers }: { questions: IQuestion[]; answers: FieldValues }) => {
  const { t } = useTranslation()
  const styles = useMultiStyleConfig('ConfirmModal')
  const { cancel, proceed } = useConfirm()

  return (
    <>
      <ModalHeader>
        <Box bgImage={`url(${confirmImg})`} />
      </ModalHeader>
      <ModalBody display='flex' flexDirection='column' gap={5} p={0} mb={2}>
        <Text>{t('process.spreadsheet.confirm.description')}</Text>
        <Flex
          flexDirection='column'
          maxH='200px'
          overflowY='scroll'
          boxShadow='rgba(128, 128, 128, 0.42) 1px 1px 1px 1px'
          px={2}
          borderRadius='lg2'
        >
          {questions.map((q, i) => (
            <Box key={i}>
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
      <ModalFooter sx={styles.footer}>
        <Button onClick={cancel!} variant='ghost' sx={styles.cancel}>
          {t('cc.confirm.cancel')}
        </Button>
        <Button onClick={proceed!} sx={styles.confirm}>
          {t('cc.confirm.confirm')}
        </Button>
      </ModalFooter>
    </>
  )
}
