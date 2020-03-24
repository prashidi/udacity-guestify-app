import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import {
  createGuest,
  deleteGuest,
  getGuests,
  patchGuest
} from '../api/guests-api'
import Auth from '../auth/Auth'
import { Guest } from '../types/Guest'

interface GuestsProps {
  auth: Auth
  history: History
}

interface GuestsState {
  guests: Guest[]
  newGuestName: string
  loadingGuests: boolean
}

export class Guests extends React.PureComponent<GuestsProps, GuestsState> {
  state: GuestsState = {
    guests: [],
    newGuestName: '',
    loadingGuests: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newGuestName: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/guests/${todoId}/edit`)
  }

  onGuestCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const guestType = 'Single'
      const tableNumber = 1
      const newGuest = await createGuest(this.props.auth.getIdToken(), {
        name: this.state.newGuestName,
        table: tableNumber,
        type: guestType
      })
      this.setState({
        guests: [...this.state.guests, newGuest],
        newGuestName: ''
      })
    } catch {
      alert('Guest creation failed')
    }
  }

  onGuestDelete = async (guestId: string) => {
    try {
      await deleteGuest(this.props.auth.getIdToken(), guestId)
      this.setState({
        guests: this.state.guests.filter(guest => guest.guestId != guestId)
      })
    } catch {
      alert('Guest deletion failed')
    }
  }

  onGuestCheck = async (pos: number) => {
    try {
      const guest = this.state.guests[pos]
      await patchGuest(this.props.auth.getIdToken(), guest.guestId, {
        name: guest.name,
        table: guest.table,
        checkin: !guest.checkin,
        type: guest.type
      })
      this.setState({
        guests: update(this.state.guests, {
          [pos]: { checkin: { $set: !guest.checkin } }
        })
      })
    } catch {
      alert('Guest update failed')
    }
  }

  async componentDidMount() {
    try {
      const guests = await getGuests(this.props.auth.getIdToken())
      this.setState({
        guests,
        loadingGuests: false
      })
      console.log('Guests: ', guests)
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">GUESTS</Header>

        {this.renderCreateGuestInput()}

        {this.renderGuests()}
      </div>
    )
  }

  renderCreateGuestInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'orange',
              labelPosition: 'left',
              icon: 'add',
              content: 'New guest',
              onClick: this.onGuestCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Enter Guest name"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderGuests() {
    if (this.state.loadingGuests) {
      return this.renderLoading()
    }

    return this.renderGuestsList()
  }

  renderLoading() {
    console.log('State: ', this.state)
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Guests
        </Loader>
      </Grid.Row>
    )
  }

  renderGuestsList() {
    return (
      <Grid padded>
        <Grid.Row as="h4">
          <Grid.Column width={1} verticalAlign="middle"></Grid.Column>
          <Grid.Column width={7} verticalAlign="middle">
            Names
          </Grid.Column>
          <Grid.Column width={3} verticalAlign="middle">
            Table numbers
          </Grid.Column>
          <Grid.Column width={3} verticalAlign="middle">
            Types
          </Grid.Column>
        </Grid.Row>
        {this.state.guests.map((guest, pos) => {
          return (
            <Grid.Row key={guest.guestId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onGuestCheck(pos)}
                  checked={guest.checkin}
                />
              </Grid.Column>
              <Grid.Column width={7} verticalAlign="middle">
                {guest.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {guest.table}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {guest.type}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(guest.guestId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onGuestDelete(guest.guestId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {guest.attachmentUrl && (
                <Image src={guest.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
