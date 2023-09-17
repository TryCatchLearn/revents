import { Header, Icon, Segment } from 'semantic-ui-react'

type Props = {
    title?: string
}

export default function EmptyState({title = 'No matches for this filter'}: Props) {
  return (
    <Segment placeholder>
        <Header icon>
            <Icon name='search' />
            {title}
        </Header>
    </Segment>
  )
}