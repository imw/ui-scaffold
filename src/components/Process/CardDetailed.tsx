import { Box, Card, CardBody, CardFooter, Text } from '@chakra-ui/react'
import { ElectionActions, ElectionDescription, ElectionStatusBadge, ElectionTitle } from '@vocdoni/chakra-components'
import { ElectionProvider, enforceHexPrefix, useElection } from '@vocdoni/react-providers'
import { ElectionStatus, InvalidElection, PublishedElection } from '@vocdoni/sdk'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useReadMoreMarkdown } from '~components/Layout/use-read-more'
import { useDateFns } from '~i18n/use-date-fns'
import { ProcessDateInline } from './Date'

interface Props {
  election: PublishedElection
}

const ProcessCardDetailed = ({ election }: Props) => {
  return (
    <ElectionProvider election={election}>
      <Card variant='detailed'>
        <CardBody>
          <Link to={`/processes/${enforceHexPrefix(election.id)}`}>
            <ProcessDetailedCardTitle />
            <Box>
              <ElectionStatusBadge />
              <ProcessDetailedCreationDate />
            </Box>
            <ProcessDetailedCardDescription />
          </Link>
          <ElectionActions />
        </CardBody>

        <CardFooter>
          <ProcessDetailedCardFooter />
        </CardFooter>
      </Card>
    </ElectionProvider>
  )
}

export default ProcessCardDetailed

const ProcessDetailedCreationDate = () => {
  const { election } = useElection()
  const { format } = useDateFns()

  if (!election?.creationTime) return null

  return <Text>{format(new Date(election.creationTime), 'PPP')}</Text>
}

const ProcessDetailedCardTitle = () => {
  const { election } = useElection()
  const { t } = useTranslation()

  if (election instanceof InvalidElection) {
    return (
      <Text fontStyle='italic' color='primary.main'>
        {t('process.is_invalid')}
      </Text>
    )
  }

  return <ElectionTitle as='p' />
}

const ProcessDetailedCardDescription = () => {
  const { election } = useElection()
  const { t } = useTranslation()
  const { ReadMoreMarkdownWrapper } = useReadMoreMarkdown(100)

  if (election instanceof InvalidElection) {
    return null
  }

  return (
    <>
      {election?.status !== ElectionStatus.CANCELED ? (
        <ReadMoreMarkdownWrapper>
          <ElectionDescription />
        </ReadMoreMarkdownWrapper>
      ) : (
        <Box>
          <Text>{t('process.status.canceled')}</Text>
        </Box>
      )}
    </>
  )
}

const ProcessDetailedCardFooter = () => {
  const { t } = useTranslation()
  const { election } = useElection()

  if (election instanceof InvalidElection) {
    return null
  }

  if (election?.status === ElectionStatus.CANCELED) return null

  return (
    <Box>
      <Box>
        <ProcessDateInline />
      </Box>
      <Box>
        <Text>{t('process.voters')}</Text>
        <Text>{election?.voteCount}</Text>
      </Box>
    </Box>
  )
}
