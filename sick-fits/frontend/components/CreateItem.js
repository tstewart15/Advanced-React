import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import router from 'next/router';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: 'Cool Shoes',
    description: 'I love contenttt',
    image: 'dog.jpg',
    largeImage: 'large-dog.jpg',
    price: 90000,
  };

  handleChange = event => {
    const { name, type, value } = event.target;
    const typedValue = type === 'number' ? parseFloat(value) : value;
    this.setState({
      [name]: typedValue,
    });
  };

  uploadFile = async e => {
    this.setState({
      imageLoading: true,
    });

    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch('https://api.cloudinary.com/v1_1/tomstewart/image/upload', {
      method: 'POST',
      body: data,
    });

    const file = await res.json();

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
      imageLoading: false,
    })
  };

  render() {
    const {
      imageLoading,
    } = this.state
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading: mutationLoading, error }) => (
          <Form onSubmit={async e => {
            e.preventDefault();
            const res = await createItem();
            router.push({
              pathname: '/item',
              query: {
                id: res.data.createItem.id,
              },
            });
          }}>
            <ErrorMessage error={error} />
            <fieldset disabled={mutationLoading || imageLoading} aria-busy={mutationLoading || imageLoading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.uploadFile}
                />
                {this.state.image && <img width="200" src={this.state.image} alt="Upload preview" />}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
