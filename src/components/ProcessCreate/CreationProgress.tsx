import { Flex, Img, List, ListItem, Stack, Text } from '@chakra-ui/react'
import { ElectionCreationSteps } from '@vocdoni/sdk'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import checkIcon from '/assets/check-icon.svg'
import closeIcon from '/assets/close-icon.svg'

export type Steps =
  | ElectionCreationSteps.CENSUS_CREATED
  | ElectionCreationSteps.SIGN_TX
  | ElectionCreationSteps.DONE
  | undefined

type CreationProgressProps = {
  error: string | null
  sending: boolean
  step: Steps
}

const EmptyCreationStepsState = {
  [ElectionCreationSteps.CENSUS_CREATED]: false,
  [ElectionCreationSteps.SIGN_TX]: false,
  [ElectionCreationSteps.DONE]: false,
}
type CreationStepsState = typeof EmptyCreationStepsState

export const CreationProgress = ({ error, sending, step }: CreationProgressProps) => {
  const [steps, setSteps] = useState<CreationStepsState>(EmptyCreationStepsState)
  const { t } = useTranslation()
  const labels: { [key: string]: string } = {
    [ElectionCreationSteps.CENSUS_CREATED]: t('process_create.creation_steps.census_created'),
    [ElectionCreationSteps.SIGN_TX]: t('process_create.creation_steps.sign_tx'),
    [ElectionCreationSteps.DONE]: t('process_create.creation_steps.done'),
  }

  // clear steps on render
  useEffect(() => {
    setSteps(EmptyCreationStepsState)
  }, [])

  // step status changes
  useEffect(() => {
    if (!step || steps[step]) return

    setSteps((steps: CreationStepsState) => ({
      ...steps,
      [step]: true,
    }))
  }, [step])

  return (
    <Stack>
      <Text mb={6} textAlign='center' color='modal_description'>
        {t('process_create.creation_steps_description')}
      </Text>
      <List spacing={3} pb={3}>
        {Object.keys(labels).map((key, index) => (
          <ListItem key={key} display='flex' alignItems='center' gap={2}>
            {steps[key as keyof CreationStepsState] ? (
              <Flex justifyContent='center' alignItems='center' gap={2}>
                <Flex justifyContent='center' alignItems='center' w={6} h={6} bgColor='primary.main'>
                  <Img src={checkIcon} />
                </Flex>
                <Text fontWeight='bold' color='primary.main'>
                  {labels[key]}
                </Text>
              </Flex>
            ) : (
              <>
                {!error ? (
                  <Flex justifyContent='center' alignItems='center' gap={2} color='lightgray'>
                    <Flex justifyContent='center' alignItems='center' w={6} h={6} border='1px solid'>
                      {index}
                    </Flex>
                    <Text fontWeight='bold'>{labels[key]}</Text>
                  </Flex>
                ) : (
                  <Flex justifyContent='center' alignItems='center' gap={2}>
                    <Flex justifyContent='center' alignItems='center' w={6} h={6} bgColor='error'>
                      <Img src={closeIcon} />
                    </Flex>
                    <Text fontWeight='bold' color='error'>
                      {labels[key]}
                    </Text>
                  </Flex>
                )}
              </>
            )}
          </ListItem>
        ))}
      </List>
      {error && (
        <Text color='error' textAlign='center' mt={5}>
          {error}
        </Text>
      )}
    </Stack>
  )
}
