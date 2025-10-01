const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Listing = sequelize.define('Listing', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    listing_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Sahibinden ilan numarası'
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    listing_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    listing_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    source: {
      type: DataTypes.STRING(50),
      defaultValue: 'sahibinden.com'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'listings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['listing_id']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['location']
      }
    ]
  });

  // Static methods
  Listing.findByListingId = function(listingId) {
    return this.findOne({ where: { listing_id: listingId } });
  };

  Listing.getActiveListings = function(limit = 50, offset = 0) {
    return this.findAndCountAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  };

  Listing.upsertListing = async function(listingData) {
    const [listing, created] = await this.findOrCreate({
      where: { listing_id: listingData.listing_id },
      defaults: listingData
    });

    if (!created) {
      // Güncelle
      await listing.update(listingData);
    }

    return { listing, created };
  };

  return Listing;
};
