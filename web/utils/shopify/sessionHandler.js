import prisma from '../prisma/index.js';
import Cryptr from 'cryptr';

const cryption = new Cryptr(process.env.ENCRYPTION_STRING);

export const storeSession = async (session) => {
  try {
    await prisma.session.upsert({
      where: { id: session.id },
      update: {
        shop: session.shop,
        state: session.state,
        isOnline: session.isOnline,
        scope: session.scope,
        accessToken: cryption.encrypt(session.accessToken),
        expires: session.expires ? new Date(session.expires) : null,
        // Handle online session specific fields
        onlineAccessInfo: session.onlineAccessInfo ? session.onlineAccessInfo : null,
        userId: session.onlineAccessInfo?.associated_user?.id || null,
        userFirstName: session.onlineAccessInfo?.associated_user?.first_name || null,
        userLastName: session.onlineAccessInfo?.associated_user?.last_name || null,
        userEmail: session.onlineAccessInfo?.associated_user?.email || null,
        isAccountOwner: session.onlineAccessInfo?.associated_user?.account_owner || null,
        userLocale: session.onlineAccessInfo?.associated_user?.locale || null,
        isCollaborator: session.onlineAccessInfo?.associated_user?.collaborator || null,
        isEmailVerified: session.onlineAccessInfo?.associated_user?.email_verified || null,
      },
      create: {
        id: session.id,
        shop: session.shop,
        state: session.state,
        isOnline: session.isOnline,
        scope: session.scope,
        accessToken: cryption.encrypt(session.accessToken),
        expires: session.expires ? new Date(session.expires) : null,
        // Handle online session specific fields
        onlineAccessInfo: session.onlineAccessInfo ? session.onlineAccessInfo : null,
        userId: session.onlineAccessInfo?.associated_user?.id || null,
        userFirstName: session.onlineAccessInfo?.associated_user?.first_name || null,
        userLastName: session.onlineAccessInfo?.associated_user?.last_name || null,
        userEmail: session.onlineAccessInfo?.associated_user?.email || null,
        isAccountOwner: session.onlineAccessInfo?.associated_user?.account_owner || null,
        userLocale: session.onlineAccessInfo?.associated_user?.locale || null,
        isCollaborator: session.onlineAccessInfo?.associated_user?.collaborator || null,
        isEmailVerified: session.onlineAccessInfo?.associated_user?.email_verified || null,
      },
    });
    return true;
  } catch (err) {
    console.error('Failed to store session:', err);
    return false;
  }
};

export const loadSession = async (id) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id },
    });

    return session;
  } catch (err) {
    console.error('Failed to load session:', err);
    return undefined;
  }
};

export const deleteSession = async (id) => {
  try {
    await prisma.session.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    console.error('Failed to delete session:', err);
    return false;
  }
};

const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;
