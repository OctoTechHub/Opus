// Import necessary libraries and define the contract
use soroban_sdk::{contractimpl, Bytes, Env, IntoVal, Vec};

contractimpl! {
    struct MetaverseContract {
        // Mapping of block IDs to their owners
        block_owners: Vec<(Bytes, Bytes)>,
        // Asset code for your platform's asset
        asset_code: Bytes,
    }
}

// Initialize the contract
impl MetaverseContract {
    fn new(env: &Env, asset_code: Bytes) -> Self {
        Self {
            block_owners: Vec::new(),
            asset_code,
        }
    }
}

// Buy a block
impl MetaverseContract {
    fn buy_block(&mut self, env: &Env, block_id: Bytes, buyer: Bytes, amount: u64) {
        // Check if the block is available for sale
        if let Some(owner) = self.get_block_owner(block_id) {
            // Check if the buyer has sufficient assets
            if env.balance(buyer, self.asset_code) >= amount {
                // Update the block ownership
                self.set_block_owner(block_id, buyer);
                // Transfer assets from buyer to seller
                env.transfer(owner, buyer, self.asset_code, amount);
            } else {
                // Insufficient assets, revert the transaction
                env.revert();
            }
        } else {
            // Block is not available for sale, revert the transaction
            env.revert();
        }
    }
}

// Sell a block
impl MetaverseContract {
    fn sell_block(&mut self, env: &Env, block_id: Bytes, seller: Bytes, amount: u64) {
        // Check if the seller owns the block
        if self.get_block_owner(block_id) == Some(seller) {
            // Check if the buyer has sufficient assets
            if env.balance(env.source_account(), self.asset_code) >= amount {
                // Update the block ownership
                self.set_block_owner(block_id, env.source_account());
                // Transfer assets from buyer to seller
                env.transfer(env.source_account(), seller, self.asset_code, amount);
            } else {
                // Insufficient assets, revert the transaction
                env.revert();
            }
        } else {
            // Seller does not own the block, revert the transaction
            env.revert();
        }
    }
}

// Helper functions
impl MetaverseContract {
    fn get_block_owner(&self, block_id: Bytes) -> Option<Bytes> {
        self.block_owners.iter().find(|&&(id, )| id == block_id).map(|&(owner)| owner)
    }

    fn set_block_owner(&mut self, block_id: Bytes, owner: Bytes) {
        self.block_owners.push((block_id, owner));
    }
}